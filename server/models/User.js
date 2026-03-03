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

  // Add inside your existing schema
googleAccessToken:    { type: String, default: null },
googleRefreshToken:   { type: String, default: null },
googleTokenExpiry:    { type: Date,   default: null },
googleConnected:      { type: Boolean, default: false },
googleEmail:          { type: String, default: null },

microsoftAccessToken:  { type: String, default: null },
microsoftRefreshToken: { type: String, default: null },
microsoftTokenExpiry:  { type: Date,   default: null },
microsoftConnected:    { type: Boolean, default: false },
microsoftEmail:        { type: String, default: null },

lastEmailScan:         { type: Date,   default: null },



}, { timestamps: true })

module.exports = mongoose.model('User', userSchema)
