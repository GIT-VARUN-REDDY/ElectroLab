const express = require('express');
const router = express.Router();
const {
  signup,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
  resendVerification,
  getMe,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-verification', resendVerification);
router.get('/me', protect, getMe);

module.exports = router;