const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },

  // Avatar
  avatarColor: { type: String, default: '#C84B31' },

  // Job search preferences
  preferences: {
    targetRole:  { type: String, default: '' },
    industry:    { type: String, default: '' },
    salaryMin:   { type: Number, default: null },
    salaryMax:   { type: Number, default: null },
    jobType:     { type: String, default: 'full-time', enum: ['full-time', 'part-time', 'contract', 'internship', 'remote'] },
  },

  // Google OAuth
  googleAccessToken:  { type: String,  default: null },
  googleRefreshToken: { type: String,  default: null },
  googleTokenExpiry:  { type: Date,    default: null },
  googleConnected:    { type: Boolean, default: false },
  googleEmail:        { type: String,  default: null },

  // Microsoft OAuth
  microsoftAccessToken:  { type: String,  default: null },
  microsoftRefreshToken: { type: String,  default: null },
  microsoftTokenExpiry:  { type: Date,    default: null },
  microsoftConnected:    { type: Boolean, default: false },
  microsoftEmail:        { type: String,  default: null },

  lastEmailScan: { type: Date, default: null },

}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)