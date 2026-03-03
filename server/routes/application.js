const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Application = require('../models/Application');
const { protect: auth } = require('../middleware/authMiddleware');

// GET /api/applications — Get all applications with optional filters
router.get('/', auth, async (req, res) => {
  try {
    const { status, role, industry, company, priority, search, sortBy = 'appliedDate', order = 'desc' } = req.query;

    const filter = { userId: req.user.id };
    if (status) filter.status = status;
    if (role) filter.role = { $regex: role, $options: 'i' };
    if (industry) filter.industry = industry;
    if (company) filter.company = { $regex: company, $options: 'i' };
    if (priority) filter.priority = priority;
    if (search) {
      filter.$or = [
        { company: { $regex: search, $options: 'i' } },
        { role: { $regex: search, $options: 'i' } },
        { industry: { $regex: search, $options: 'i' } },
      ];
    }

    const sortOrder = order === 'asc' ? 1 : -1;
    const applications = await Application.find(filter).sort({ [sortBy]: sortOrder });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications/stats — Dashboard stats
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const stats = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const total = await Application.countDocuments({ userId });

    const formatted = {
      total,
      applied: 0,
      underReview: 0,
      accepted: 0,
      rejected: 0,
      noResponse: 0,
    };

    stats.forEach(s => {
      const key = s._id.replace(/-([a-z])/g, g => g[1].toUpperCase());
      formatted[key] = s.count;
    });

    // Monthly breakdown for chart
    const monthly = await Application.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { month: { $month: '$appliedDate' }, year: { $year: '$appliedDate' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    res.json({ success: true, data: { ...formatted, monthly } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/applications/:id — Get single application
router.get('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOne({ _id: req.params.id, userId: req.user.id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/applications — Create new application
router.post('/', auth, async (req, res) => {
  try {
    const application = await Application.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// PUT /api/applications/:id — Update application
router.put('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, data: app });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// DELETE /api/applications/:id — Delete application
router.delete('/:id', auth, async (req, res) => {
  try {
    const app = await Application.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!app) return res.status(404).json({ success: false, message: 'Application not found' });
    res.json({ success: true, message: 'Application deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;