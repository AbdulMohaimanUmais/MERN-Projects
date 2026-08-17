const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  isGroup: { type: Boolean, default: false },
  name: { type: String, trim: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
  admin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

module.exports = mongoose.model('Chat', chatSchema);