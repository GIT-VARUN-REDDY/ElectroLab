const express = require('express');
const router = express.Router();
const { getProjects, getProject, createProject, updateProject, deleteProject, toggleLike, getTrending, adminGetProjects, deleteProjectImage, uploadDocument } = require('../controllers/projectController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { handleProjectImageUpload, handleProjectDocUpload } = require('../middleware/uploadMiddleware');

router.get('/', getProjects);
router.get('/trending', getTrending);
router.get('/admin/all', protect, adminOnly, adminGetProjects);
router.get('/:slug', optionalAuth, getProject);
router.post('/:id/like', protect, toggleLike);
router.post('/', protect, adminOnly, handleProjectImageUpload, createProject);
router.put('/:id', protect, adminOnly, handleProjectImageUpload, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.delete('/:id/image', protect, adminOnly, deleteProjectImage);
router.post('/:id/document', protect, adminOnly, handleProjectDocUpload, uploadDocument);

module.exports = router;