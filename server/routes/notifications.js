const express = require('express')
const router  = express.Router()
const { protect } = require('../middleware/authMiddleware')
const Notification = require('../models/Notification')

// GET /api/notifications — get all for current user
router.get('/', protect, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false })
    res.json({ success: true, data: notifications, unreadCount })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/notifications/:id/read — mark one as read
router.put('/:id/read', protect, async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { read: true }
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// PUT /api/notifications/read-all — mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, read: false }, { read: true })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

// DELETE /api/notifications/:id — delete one
router.delete('/:id', protect, async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, userId: req.user._id })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ success: false, message: err.message })
  }
})

module.exports = router