const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const { sendMessage, getChats, getChatById } = require('../controllers/chatController');

router.use(protect);
router.post('/message', sendMessage);
router.get('/', getChats);
router.get('/:id', getChatById);

module.exports = router;