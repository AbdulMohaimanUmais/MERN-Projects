const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const protect = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/users', protect, async (req, res) => {
  const User = require('../models/User');
  const users = await User.find().select('_id name email');
  res.json(users);
});

module.exports = router;