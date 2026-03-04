const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', default: null },
  type:          { type: String, enum: ['follow-up', 'interview', 'weekly-summary'], required: true },
  title:         { type: String, required: true },
  message:       { type: String, required: true },
  read:          { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)