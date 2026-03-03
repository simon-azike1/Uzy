const express   = require('express')
const router    = express.Router()
const { google } = require('googleapis')
const User       = require('../models/User')
const Application = require('../models/Application')
const { protect: auth } = require('../middleware/authMiddleware')
const { googleOAuthClient, GOOGLE_SCOPES } = require('../config/oauth')
const { scanGmail } = require('../services/gmail.service')
// ── Helpers ──────────────────────────────────────────────────────────────────

// Save detected applications, skip duplicates by sourceEmail
const saveApplications = async (userId, applications) => {
  let saved = 0
  let dupes = 0

  for (const app of applications) {
    const exists = await Application.findOne({ userId, sourceEmail: app.sourceEmail })
    if (exists) { dupes++; continue }
    await Application.create({ ...app, userId })
    saved++
  }

  return { saved, dupes }
}

// ── Google OAuth ──────────────────────────────────────────────────────────────

// Step 1 — redirect user to Google consent screen
router.get('/google/connect', auth, (req, res) => {
  const url = googleOAuthClient.generateAuthUrl({
    access_type: 'offline',
    prompt:      'consent',
    scope:       GOOGLE_SCOPES,
    state:       req.user.id,
  })
  res.json({ url })
})

// Step 2 — Google redirects back here with auth code
router.get('/google/callback', async (req, res) => {
    try {
      const { code, state: userId } = req.query
  
      console.log('1. Callback hit — userId:', userId)
  
      const { tokens } = await googleOAuthClient.getToken(code)
      console.log('2. Tokens received — access_token:', !!tokens.access_token, '— refresh_token:', !!tokens.refresh_token)
  
      googleOAuthClient.setCredentials(tokens)
  
      const oauth2 = google.oauth2({ version: 'v2', auth: googleOAuthClient })
      const info   = await oauth2.userinfo.get()
      const gmailAddress = info.data.email
      console.log('3. Gmail address:', gmailAddress)
  
      const user = await User.findById(userId)
      console.log('4. User found:', !!user, user?._id)
  
      user.googleAccessToken  = tokens.access_token
      user.googleRefreshToken = tokens.refresh_token
      user.googleTokenExpiry  = new Date(tokens.expiry_date)
      user.googleConnected    = true
      user.googleEmail        = gmailAddress
      await user.save()
      console.log('5. User saved successfully')
  
      const applications = await scanGmail(user)
      console.log('6. Applications found:', applications.length)
      const { saved, dupes } = await saveApplications(userId, applications)
  
      user.lastEmailScan = new Date()
      await user.save()
  
      res.redirect(`${process.env.CLIENT_URL}/dashboard?emailConnected=google&found=${saved}`)
  
    } catch (err) {
      console.error('Google OAuth callback error:', err.message)
      res.redirect(`${process.env.CLIENT_URL}/dashboard?emailError=google`)
    }
  }) 

//   New I ADDED


// ── Microsoft OAuth ───────────────────────────────────────────────────────────

// Step 1 — redirect user to Microsoft consent screen
router.get('/microsoft/connect', auth, (req, res) => {
  const params = new URLSearchParams({
    client_id:     process.env.MICROSOFT_CLIENT_ID,
    response_type: 'code',
    redirect_uri:  process.env.MICROSOFT_REDIRECT_URI,
    scope:         MICROSOFT_SCOPES.join(' '),
    state:         req.user.id,
    prompt:        'consent',
  })

  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`
  res.json({ url })
})

// Step 2 — Microsoft redirects back here with auth code
router.get('/microsoft/callback', async (req, res) => {
  try {
    const { code, state: userId } = req.query

    // Exchange code for tokens
    const tokenRes = await fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
      method:  'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body:    new URLSearchParams({
        client_id:     process.env.MICROSOFT_CLIENT_ID,
        client_secret: process.env.MICROSOFT_CLIENT_SECRET,
        code,
        redirect_uri:  process.env.MICROSOFT_REDIRECT_URI,
        grant_type:    'authorization_code',
      }).toString(),
    })

    const tokens = await tokenRes.json()
    if (!tokens.access_token) throw new Error('No access token returned')

    // Get user's Outlook email address
    const profileRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: 'Bearer ' + tokens.access_token },
    })
    const profile = await profileRes.json()

    // Save tokens to user
    const user = await User.findById(userId)
    user.microsoftAccessToken  = tokens.access_token
    user.microsoftRefreshToken = tokens.refresh_token
    user.microsoftTokenExpiry  = new Date(Date.now() + tokens.expires_in * 1000)
    user.microsoftConnected    = true
    user.microsoftEmail        = profile.mail || profile.userPrincipalName
    await user.save()

    // Scan inbox immediately
    const applications = await scanOutlook(user)
    const { saved, dupes } = await saveApplications(userId, applications)

    user.lastEmailScan = new Date()
    await user.save()

    res.redirect(`${process.env.CLIENT_URL}/dashboard?emailConnected=microsoft&found=${saved}`)

  } catch (err) {
    console.error('Microsoft OAuth callback error:', err)
    res.redirect(`${process.env.CLIENT_URL}/dashboard?emailError=microsoft`)
  }
})

// ── Status & Disconnect ───────────────────────────────────────────────────────

// Get current email connection status
router.get('/status', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      'googleConnected googleEmail microsoftConnected microsoftEmail lastEmailScan'
    )
    res.json({
      google: {
        connected: user.googleConnected,
        email:     user.googleEmail,
      },
      microsoft: {
        connected: user.microsoftConnected,
        email:     user.microsoftEmail,
      },
      lastScan: user.lastEmailScan,
    })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Disconnect Google
router.delete('/google/disconnect', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      googleAccessToken:  null,
      googleRefreshToken: null,
      googleTokenExpiry:  null,
      googleConnected:    false,
      googleEmail:        null,
    })
    res.json({ message: 'Google account disconnected' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// Disconnect Microsoft
router.delete('/microsoft/disconnect', auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      microsoftAccessToken:  null,
      microsoftRefreshToken: null,
      microsoftTokenExpiry:  null,
      microsoftConnected:    false,
      microsoftEmail:        null,
    })
    res.json({ message: 'Microsoft account disconnected' })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router