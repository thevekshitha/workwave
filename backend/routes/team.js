const express = require('express');
const { createTeam, joinTeam, getTeamMembers } = require('../controllers/team');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createTeam);
router.post('/join/:teamId', protect, joinTeam);
router.get('/members', protect, getTeamMembers);

module.exports = router;
