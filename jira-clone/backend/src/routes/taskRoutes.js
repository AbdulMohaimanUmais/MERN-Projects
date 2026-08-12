const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createTask, getTasksByProject, updateTask, deleteTask, addComment
} = require('../controllers/taskController');

router.use(protect);
router.post('/', createTask);
router.get('/project/:projectId', getTasksByProject);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;