const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { accessChat, getChats, createGroupChat } = require('../controllers/chatController');

router.use(protect);
router.post('/', accessChat);
router.get('/', getChats);
router.post('/group', createGroupChat);

module.exports = router;