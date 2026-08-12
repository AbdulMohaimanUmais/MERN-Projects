const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

router.use(protect);

router.get('/project/:projectId', async (req, res) => {
  const logs = await Activity.find({ project: req.params.projectId })
    .populate('user', 'name')
    .sort('-createdAt')
    .limit(50);
  res.json(logs);
});

router.get('/notifications', async (req, res) => {
  const notifs = await Notification.find({ user: req.user.id }).sort('-createdAt').limit(30);
  res.json(notifs);
});

router.put('/notifications/:id/read', async (req, res) => {
  const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
  res.json(notif);
});

module.exports = router;