const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { createCheckoutSession } = require('../controllers/subscriptionController');

router.post('/checkout', protect, createCheckoutSession);

module.exports = router;