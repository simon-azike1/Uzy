const { google }        = require('googleapis')
const { googleOAuthClient } = require('../config/oauth')
const { parseEmail }    = require('./emailParser')

// Refresh access token if expired
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

// Decode base64 Gmail message body
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

// Scan Gmail inbox for job application emails
const scanGmail = async (user) => {
  const auth   = await refreshGoogleToken(user)
  const gmail  = google.gmail({ version: 'v1', auth })

  // Date filter — past 3 months
  const threeMonthsAgo = new Date()
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)
  const after = Math.floor(threeMonthsAgo.getTime() / 1000)

  // Search query — common job application keywords
  const query = `after:${after} (subject:("application received" OR "application confirmed" OR "thank you for applying" OR "thanks for applying" OR "we received your application" OR "you applied" OR "application submitted" OR "successfully applied"))`

  const listRes = await gmail.users.messages.list({
    userId:   'me',
    q:        query,
    maxResults: 200,
  })

  const messages = listRes.data.messages || []
  if (messages.length === 0) return []

  const applications = []

  for (const msg of messages) {
    try {
      const full = await gmail.users.messages.get({
        userId: 'me',
        id:     msg.id,
        format: 'full',
      })

      const headers = full.data.payload.headers || []
      const get = (name) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || ''

      const from    = get('From')
      const subject = get('Subject')
      const date    = get('Date')
      const body    = decodeBody(full.data.payload)

      const parsed = parseEmail({ id: msg.id, from, subject, body, date })
      if (parsed) applications.push(parsed)

    } catch (err) {
      console.error('Error parsing Gmail message', msg.id, err.message)
    }
  }

  return applications
}

module.exports = { scanGmail }