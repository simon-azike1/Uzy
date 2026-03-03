const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  role: {
    type: String,
    required: [true, 'Job role is required'],
    trim: true,
  },
  industry: {
    type: String,
    trim: true,
    default: 'Other',
  },
  status: {
    type: String,
    enum: ['applied', 'under-review', 'accepted', 'rejected', 'no-response'],
    default: 'applied',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
  jobDescription: {
    type: String,
    trim: true,
  },
  jobUrl: {
    type: String,
    trim: true,
  },
  salary: {
    min: Number,
    max: Number,
    currency: { type: String, default: 'USD' },
  },
  location: {
    type: String,
    trim: true,
  },
  isRemote: {
    type: Boolean,
    default: false,
  },
  notes: {
    type: String,
    trim: true,
  },
  resumeUsed: {
    type: String, // reference to resume filename or ID
  },
  coverLetterUsed: {
    type: String,
  },
  // Email detection metadata
  sourceEmail: {
    type: String, // email message ID it was detected from
  },
  autoDetected: {
    type: Boolean,
    default: false,
  },
  followUpDate: {
    type: Date,
  },
  interviewDate: {
    type: Date,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Index for fast user queries
applicationSchema.index({ userId: 1, status: 1 });
applicationSchema.index({ userId: 1, appliedDate: -1 });

module.exports = mongoose.model('Application', applicationSchema);