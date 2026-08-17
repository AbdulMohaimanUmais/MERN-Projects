const Message = require('../models/Message');
const Chat = require('../models/Chat');

// Send message
exports.sendMessage = async (req, res) => {
  const { chatId, content, fileUrl, replyTo } = req.body;
  if (!chatId || (!content && !fileUrl)) {
    return res.status(400).json({ message: 'chatId and content/fileUrl required' });
  }

  let message = await Message.create({
    sender: req.user._id,
    chat: chatId,
    content: content || '',
    fileUrl: fileUrl || '',
    replyTo: replyTo || null,
    readBy: [req.user._id],
  });

  message = await message.populate('sender', 'username avatar');
  message = await message.populate({ path: 'replyTo', populate: { path: 'sender', select: 'username' } });
  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  req.io.to(chatId).emit('newMessage', message);
  res.status(201).json(message);
};

// Get all messages of a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
  .populate('sender', 'username avatar')
  .populate({ path: 'replyTo', populate: { path: 'sender', select: 'username' } })
  .sort({ createdAt: 1 });

  await Message.updateMany(
    { chat: chatId, readBy: { $ne: req.user._id } },
    { $push: { readBy: req.user._id } }
  );

  res.json(messages);
};

// Search messages (within a chat)
exports.searchMessages = async (req, res) => {
  const { chatId } = req.params;
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: 'query required' });

  const messages = await Message.find({
    chat: chatId,
    content: { $regex: q, $options: 'i' },
  }).populate('sender', 'username avatar');

  res.json(messages);
};

// Mark messages as read
exports.markAsRead = async (req, res) => {
  const { chatId } = req.params;

  await Message.updateMany(
    { chat: chatId, readBy: { $ne: req.user._id } },
    { $push: { readBy: req.user._id } }
  );

  res.json({ message: 'Marked as read' });
};


exports.deleteMessage = async (req, res) => {
  const { id } = req.params;

  const message = await Message.findById(id);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  if (message.sender.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this message' });
  }

  message.content = 'This message was deleted';
  message.fileUrl = '';
  message.deleted = true;
  await message.save();

  req.io.to(message.chat.toString()).emit('messageDeleted', { messageId: id, chatId: message.chat });

  res.json({ message: 'Deleted', messageId: id });
};



exports.editMessage = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  const message = await Message.findById(id);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  if (message.sender.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to edit this message' });
  }

  message.content = content;
  message.edited = true;
  await message.save();

  req.io.to(message.chat.toString()).emit('messageEdited', { messageId: id, content, chatId: message.chat });

  res.json(message);
};




exports.reactToMessage = async (req, res) => {
  const { id } = req.params;
  const { emoji } = req.body;

  const message = await Message.findById(id);
  if (!message) return res.status(404).json({ message: 'Message not found' });

  const existingIndex = message.reactions.findIndex(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (existingIndex > -1) {
    if (message.reactions[existingIndex].emoji === emoji) {
      message.reactions.splice(existingIndex, 1);
    } else {
      message.reactions[existingIndex].emoji = emoji;
    }
  } else {
    message.reactions.push({ user: req.user._id, emoji });
  }

  await message.save();
  req.io.to(message.chat.toString()).emit('messageReaction', { messageId: id, reactions: message.reactions, chatId: message.chat });

  res.json(message);
};