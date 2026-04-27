const Team = require('../models/Team');
const User = require('../models/User');

// @desc    Create new team
// @route   POST /api/teams
// @access  Private (Manager only)
exports.createTeam = async (req, res, next) => {
  try {
    if (req.user.teamId) {
      return res.status(400).json({ success: false, message: 'User is already in a team' });
    }

    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ success: false, message: 'Team name is required' });
    }

    const team = await Team.create({
      name: name.trim(),
      createdBy: req.user.id,
      members: [req.user.id],
      role: 'manager',
    });

    await User.findByIdAndUpdate(req.user.id, {
      teamId: team._id,
      role: 'manager',
    });

    res.status(201).json({
      success: true,
      data: {
        team: {
          name: team.name,
          teamId: team.teamId,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Join a team
// @route   POST /api/teams/join/:teamId
// @access  Private
exports.joinTeam = async (req, res, next) => {
  try {
    if (req.user.teamId) {
      return res.status(400).json({ success: false, message: 'User is already in a team' });
    }

    const teamId = String(req.params.teamId || '').trim();
    const team = await Team.findOne({ teamId });

    if (!team) {
      return res.status(404).json({ success: false, message: 'Team not found' });
    }

    await Team.findByIdAndUpdate(team._id, {
      $addToSet: { members: req.user.id },
    });

    await User.findByIdAndUpdate(req.user.id, {
      teamId: team._id,
    });

    res.status(200).json({
      success: true,
      data: {
        team: {
          name: team.name,
          teamId: team.teamId,
        },
      },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// @desc    Get team members
// @route   GET /api/teams/members
// @access  Private
exports.getTeamMembers = async (req, res, next) => {
  try {
    if (!req.user.teamId) {
      return res.status(400).json({ success: false, message: 'User is not in a team' });
    }

    const members = await User.find({ teamId: req.user.teamId });

    res.status(200).json({
      success: true,
      data: members,
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
