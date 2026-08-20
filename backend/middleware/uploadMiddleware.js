const { uploadProjectImages, uploadProjectDoc, uploadAvatar } = require('../config/cloudinary');

const handleProjectImageUpload = (req, res, next) => {
  uploadProjectImages(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const handleProjectDocUpload = (req, res, next) => {
  uploadProjectDoc(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

const handleAvatarUpload = (req, res, next) => {
  uploadAvatar(req, res, (err) => {
    if (err) return res.status(400).json({ success: false, message: err.message });
    next();
  });
};

module.exports = { handleProjectImageUpload, handleProjectDocUpload, handleAvatarUpload };