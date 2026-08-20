const express = require('express');
const router = express.Router();
const { updateProfile, updateAvatar, changePassword, toggleSaveProject, getSavedProjects, checkSaved, getAllUsers, toggleBlockUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const { handleAvatarUpload } = require('../middleware/uploadMiddleware');

router.put('/profile', protect, updateProfile);
router.put('/avatar', protect, handleAvatarUpload, updateAvatar);
router.put('/change-password', protect, changePassword);
router.post('/save/:projectId', protect, toggleSaveProject);
router.get('/saved', protect, getSavedProjects);
router.get('/saved/check/:projectId', protect, checkSaved);
router.get('/admin/all', protect, adminOnly, getAllUsers);
router.put('/admin/:id/block', protect, adminOnly, toggleBlockUser);
router.delete('/admin/:id', protect, adminOnly, deleteUser);

module.exports = router;