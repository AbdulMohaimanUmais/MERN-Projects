const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');
const express = require('express');
const router = express.Router();


const { register, login, updateAvatar } = require('../controllers/authController');
router.get('/users', protect, async (req, res) => {
  const users = await User.find({ _id: { $ne: req.user._id } }).select('username email');
  res.json(users);
});

router.post('/register', register);
router.post('/login', login);
router.put('/avatar', protect, updateAvatar);


module.exports = router;