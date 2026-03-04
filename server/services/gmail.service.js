const { google }            = require('googleapis')
const { googleOAuthClient } = require('../config/oauth')
const { parseEmail }        = require('./emailParser')

// ── Refresh access token if expired
const refreshGoogleToken = async (user) => {
  googleOAuthClient.setCredentials({
    access_token:  user.googleAccessToken,
    refresh_token: user.googleRefreshToken,
  })

  if (new Date() >= new Date(user.googleTokenExpiry)) {
    const { credentials } = await googleOAuthClient.refreshAccessToken()
    user.googleAccessToken = credentials.access_token
    user.googleTokenExpiry = new Date(credentials.expiry_date)
    await user.save()
  }

  return googleOAuthClient
}

// ── Decode base64 Gmail message body
const decodeBody = (payload) => {
  const getBody = (parts) => {
    if (!parts) return ''
    for (const part of parts) {
      if (part.mimeType === 'text/plain' && part.body?.data) {
        return Buffer.from(part.body.data, 'base64').toString('utf-8')
      }
      if (part.parts) {
        const nested = getBody(part.parts)
        if (nested) return nested
      }
    }
    return ''
  }

  if (payload.body?.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8')
  }
  return getBody(payload.parts || [])
}

// ── Fetch a single message (used inside batch)
const fetchMessage = async (gmail, msgId) => {
  const full = await gmail.users.messages.get({
    userId: 'me',
    id:     msgId,
    format: 'full',
  })

  const headers = full.data.payload.headers || []
  const get = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

  return {
    id:      msgId,
    from:    get('From'),
    subject: get('Subject'),
    date:    get('Date'),
    body:    decodeBody(full.data.payload),
  }
}

// ── Process messages in parallel batches
const fetchInBatches = async (gmail, messageIds, batchSize = 10) => {
  const results = []

  for (let i = 0; i < messageIds.length; i += batchSize) {
    const batch = messageIds.slice(i, i + batchSize)

    const settled = await Promise.allSettled(
      batch.map(id => fetchMessage(gmail, id))
    )

    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results.push(result.value)
      } else {
        console.error('Failed to fetch message:', result.reason?.message)
      }
    }

    // Small delay between batches to avoid rate limiting
    if (i + batchSize < messageIds.length) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return results
}

// ── Scan Gmail inbox for job application emails
const scanGmail = async (user) => {
  const auth  = await refreshGoogleToken(user)
  const gmail = google.gmail({ version: 'v1', auth })

  // Date filter — past 12 months
  const twelveMonthsAgo = new Date()
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)
  const after = Math.floor(twelveMonthsAgo.getTime() / 1000)

  // Broad search query covering common job application email patterns
  const query = `after:${after} (subject:("application received" OR "application confirmed" OR "thank you for applying" OR "thanks for applying" OR "we received your application" OR "you applied" OR "application submitted" OR "successfully applied" OR "application under review" OR "your application to" OR "applied to" OR "job application"))`

  // Paginate through all results up to 500
  const messageIds = []
  let pageToken    = null

  do {
    const listRes = await gmail.users.messages.list({
      userId:     'me',
      q:          query,
      maxResults: 500,
      ...(pageToken && { pageToken }),
    })

    const messages = listRes.data.messages || []
    messageIds.push(...messages.map(m => m.id))
    pageToken = listRes.data.nextPageToken || null

    // Stop if we've collected 1000
    if (messageIds.length >= 1000) break

  } while (pageToken)

  console.log(`[Gmail] Found ${messageIds.length} matching emails — fetching in batches...`)

  if (messageIds.length === 0) return []

  // Fetch all messages in parallel batches of 10
  const rawMessages = await fetchInBatches(gmail, messageIds.slice(0, 1000), 10)

  console.log(`[Gmail] Successfully fetched ${rawMessages.length} emails — parsing...`)

  // Parse each email into application data
  const applications = []

  for (const msg of rawMessages) {
    try {
      const parsed = parseEmail(msg)
      if (parsed) applications.push(parsed)
    } catch (err) {
      console.error('Error parsing email:', msg.id, err.message)
    }
  }

  console.log(`[Gmail] Parsed ${applications.length} job applications`)

  return applications
}

module.exports = { scanGmail }