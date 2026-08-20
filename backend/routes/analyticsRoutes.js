const express = require('express');
const router = express.Router();
const { getDashboardStats, getAnalyticsData, trackVisit } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/track', trackVisit);
router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/charts', protect, adminOnly, getAnalyticsData);

module.exports = router;