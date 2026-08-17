const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, getMessages, searchMessages, markAsRead, deleteMessage, editMessage, reactToMessage } = require('../controllers/messageController');

router.use(protect);
router.post('/', sendMessage);
router.get('/:chatId', getMessages);
router.get('/:chatId/search', searchMessages);
router.put('/:chatId/read', markAsRead);
router.delete('/:id', deleteMessage);
router.put('/edit/:id', editMessage);
router.post('/react/:id', reactToMessage);

module.exports = router;