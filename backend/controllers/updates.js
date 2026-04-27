const Update = require('../models/Update');
const User = require('../models/User');

// @desc    Create daily stand-up update
// @route   POST /api/updates/create
// @access  Private
const formatUpdate = (update) => ({
  _id: update._id,
  userId: update.userId ? {
    _id: update.userId._id,
    name: update.userId.name,
    email: update.userId.email,
    role: update.userId.role,
  } : null,
  teamId: update.teamId ? String(update.teamId) : null,
  yesterday: update.yesterday,
  today: update.today,
  blockers: update.blockers,
  date: update.date,
  createdAt: update.createdAt,
});

exports.createUpdate = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ success: false, message: 'Please join a team first' });
    }

    const { yesterday, today, blockers } = req.body;

    const update = await Update.create({
      userId: req.user.id,
      teamId: req.user.teamId,
      yesterday,
      today,
      blockers,
    });

    res.status(201).json({
      success: true,
      data: {
        update: formatUpdate(update),
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get team feed (updates grouped by date)
// @route   GET /api/updates/feed
// @access  Private
exports.getFeed = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ success: false, message: 'Please join a team first' });
    }

    const updates = await Update.find({ teamId: req.user.teamId })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: updates.map(formatUpdate),
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get blocker updates for the team
// @route   GET /api/updates/blockers
// @access  Private
exports.getBlockers = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ success: false, message: 'Please join a team first' });
    }

    const blockers = await Update.find({ 
      teamId: req.user.teamId,
      blockers: { $ne: '', $exists: true }
    })
    .populate('userId', 'name email role')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: blockers.map(formatUpdate),
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
