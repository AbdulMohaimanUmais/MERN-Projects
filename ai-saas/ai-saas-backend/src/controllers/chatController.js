const Chat = require('../models/ChatHistory');
const openai = require('../utils/openai');
const User = require('../models/User');

const LIMITS = { free: 10, pro: 500 };

exports.sendMessage = async (req, res) => {
  try {
    const { chatId, message } = req.body;
    if (!message) return res.status(400).json({ message: 'Message required' });

    const user = await User.findById(req.user._id);
    if (user.usageCount >= LIMITS[user.plan])
      return res.status(403).json({ message: 'Usage limit reached, upgrade plan' });

    let chat = chatId
      ? await Chat.findOne({ _id: chatId, user: user._id })
      : await Chat.create({ user: user._id, messages: [] });

    if (!chat) return res.status(404).json({ message: 'Chat not found' });
    if (!chat.title || chat.title === 'New Chat') {
  chat.title = message.slice(0, 30) + (message.length > 30 ? '...' : '');
}
    chat.messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: chat.messages.map(m => ({ role: m.role, content: m.content })),
    });

    const reply = completion.choices[0].message.content;
    chat.messages.push({ role: 'assistant', content: reply });
    await chat.save();

    user.usageCount += 1;
    await user.save();

    res.json({ chatId: chat._id, reply, usageCount: user.usageCount, limit: LIMITS[user.plan] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getChats = async (req, res) => {
  const chats = await Chat.find({ user: req.user._id }).sort('-updatedAt');
  res.json(chats);
};

exports.getChatById = async (req, res) => {
  const chat = await Chat.findOne({ _id: req.params.id, user: req.user._id });
  if (!chat) return res.status(404).json({ message: 'Not found' });
  res.json(chat);
};