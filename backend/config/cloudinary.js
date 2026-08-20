const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const projectImageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'electrolab/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
  },
});

const projectDocStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'electrolab/documents',
    allowed_formats: ['pdf'],
    resource_type: 'raw',
  },
});

const avatarStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'electrolab/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill', gravity: 'face' }],
  },
});

const uploadProjectImages = multer({
  storage: projectImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).array('images', 10);

const uploadProjectDoc = multer({
  storage: projectDocStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single('document');

const uploadAvatar = multer({
  storage: avatarStorage,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single('avatar');

module.exports = { cloudinary, uploadProjectImages, uploadProjectDoc, uploadAvatar };