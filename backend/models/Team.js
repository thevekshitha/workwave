const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a team name'],
    trim: true,
  },
  teamId: {
    type: String,
    unique: true,
    default: () => 'TEAM' + Math.random().toString(36).substring(2, 8).toUpperCase(),
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  role: {
    type: String,
    enum: ['manager', 'member'],
    default: 'manager',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);
