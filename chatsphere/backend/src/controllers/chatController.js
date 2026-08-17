const Chat = require('../models/Chat');

// One-to-one chat create/fetch
exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'userId required' });

  let chat = await Chat.findOne({
    isGroup: false,
    participants: { $all: [req.user._id, userId], $size: 2 },
  }).populate('participants', '-password');

  if (!chat) {
    chat = await Chat.create({
      isGroup: false,
      participants: [req.user._id, userId],
    });
    chat = await chat.populate('participants', '-password');
  }

  res.json(chat);
};

// Get all chats of logged-in user
exports.getChats = async (req, res) => {
  const chats = await Chat.find({ participants: req.user._id })
    .populate('participants', '-password')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

  res.json(chats);
};

// Create group chat
exports.createGroupChat = async (req, res) => {
  const { name, participants } = req.body;
  if (!name || !participants || participants.length < 2) {
    return res.status(400).json({ message: 'Name and at least 2 participants required' });
  }

  const group = await Chat.create({
    isGroup: true,
    name,
    participants: [...participants, req.user._id],
    admin: req.user._id,
  });

  const fullGroup = await Chat.findById(group._id).populate('participants', '-password');
  res.status(201).json(fullGroup);
};