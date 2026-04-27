const express = require('express');
const { createUpdate, getFeed, getBlockers } = require('../controllers/updates');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/create', protect, createUpdate);
router.get('/feed', protect, getFeed);
router.get('/blockers', protect, getBlockers);

module.exports = router;
