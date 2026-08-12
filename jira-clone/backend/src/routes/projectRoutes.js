const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
  createProject, getProjects, getProject, addMember, deleteProject
} = require('../controllers/projectController');

router.use(protect);
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProject);
router.put('/:id/members', addMember);
router.delete('/:id', deleteProject);

module.exports = router;