const mongoose = require('mongoose');

const updateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  yesterday: {
    type: String,
    required: [true, 'Please add what you did yesterday'],
  },
  today: {
    type: String,
    required: [true, 'Please add what you are doing today'],
  },
  blockers: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Update', updateSchema);
