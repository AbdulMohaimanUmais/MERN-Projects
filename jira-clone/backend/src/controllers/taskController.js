const Task = require('../models/Task');
const { logActivity, notifyUser } = require('../utils/logActivity');

exports.createTask = async (req, res) => {
  try {
    const { title, description, project, assignee } = req.body;
    const task = await Task.create({ title, description, project, assignee });
    const io = req.app.get('io');
    io.emit('task:created', task);

    await logActivity(io, { project, user: req.user.id, action: `created task "${title}"` });
    if (assignee) {
      await notifyUser(io, { user: assignee, message: `You were assigned to "${title}"` });
    }

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate('assignee', 'name email')
      .sort('order');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignee', 'name email');
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const io = req.app.get('io');
    io.emit('task:updated', task);

    await logActivity(io, { project: task.project, user: req.user.id, action: `updated task "${task.title}" to ${task.status}` });

    if (req.body.assignee && (!oldTask.assignee || oldTask.assignee.toString() !== req.body.assignee)) {
      await notifyUser(io, { user: req.body.assignee, message: `You were assigned to "${task.title}"` });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    const io = req.app.get('io');
    io.emit('task:deleted', { id: req.params.id });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    task.comments.push({ user: req.user.id, text });
    await task.save();
    await task.populate('comments.user', 'name email');
    const io = req.app.get('io');
    io.emit('task:comment', { taskId: task._id, comments: task.comments });
    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};