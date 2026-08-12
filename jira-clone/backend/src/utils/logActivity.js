const Activity = require('../models/Activity');
const Notification = require('../models/Notification');

const logActivity = async (io, { project, user, action, meta = {} }) => {
  const activity = await Activity.create({ project, user, action, meta });
  io.emit('activity:new', activity);
  return activity;
};

const notifyUser = async (io, { user, message, link = '' }) => {
  const notif = await Notification.create({ user, message, link });
  io.to(user.toString()).emit('notification:new', notif);
  return notif;
};

module.exports = { logActivity, notifyUser };