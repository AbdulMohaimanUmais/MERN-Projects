const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  plan: { type: String, enum: ['free', 'pro'], default: 'free' },
  usageCount: { type: Number, default: 0 },
  stripeCustomerId: { type: String },
  subscriptionId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);