const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat', required: true },
  content: { type: String, trim: true },
  fileUrl: { type: String, default: '' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  deleted: { type: Boolean, default: false },
  edited: { type: Boolean, default: false },
  reactions: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  emoji: { type: String },
}],
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);