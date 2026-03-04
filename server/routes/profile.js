const express = require('express')
const router  = express.Router()
const bcrypt  = require('bcryptjs')
const { protect } = require('../middleware/authMiddleware')
const User = require('../models/User')

// GET /api/profile
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -googleAccessToken -googleRefreshToken -microsoftAccessToken -microsoftRefreshToken')
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })
    res.json({ success: true, data: user })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/profile
router.put('/', protect, async (req, res) => {
  try {
    const { name, email, avatarColor, preferences } = req.body
    const user = await User.findById(req.user._id)
    if (!user) return res.status(404).json({ success: false, message: 'User not found' })

    if (email && email !== user.email) {
      const exists = await User.findOne({ email: email.toLowerCase() })
      if (exists) return res.status(400).json({ success: false, message: 'Email already in use' })
    }

    if (name)        user.name        = name.trim()
    if (email)       user.email       = email.toLowerCase().trim()
    if (avatarColor) user.avatarColor = avatarColor
    if (preferences) {
        user.preferences = {
          targetRole:  preferences.targetRole  ?? user.preferences?.targetRole  ?? '',
          industry:    preferences.industry    ?? user.preferences?.industry    ?? '',
          salaryMin:   preferences.salaryMin   ?? user.preferences?.salaryMin   ?? null,
          salaryMax:   preferences.salaryMax   ?? user.preferences?.salaryMax   ?? null,
          jobType:     preferences.jobType     ?? user.preferences?.jobType     ?? 'full-time',
        }
        user.markModified('preferences')
      }

    await user.save()
    const updated = await User.findById(user._id).select('-password -googleAccessToken -googleRefreshToken -microsoftAccessToken -microsoftRefreshToken')
    res.json({ success: true, data: updated })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/profile/password
router.put('/password', protect, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Both fields are required' })
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' })

    const user = await User.findById(req.user._id)
    const match = await bcrypt.compare(currentPassword, user.password)
    if (!match) return res.status(400).json({ success: false, message: 'Current password is incorrect' })

    user.password = await bcrypt.hash(newPassword, 12)
    await user.save()

    res.json({ success: true, message: 'Password updated successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router