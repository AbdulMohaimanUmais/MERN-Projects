const express = require('express');
const router = express.Router();
const { getSalesAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/analytics', protect, admin, getSalesAnalytics);

module.exports = router;