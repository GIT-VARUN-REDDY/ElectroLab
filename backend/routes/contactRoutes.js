const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContact, getContacts, updateContactStatus, subscribeNewsletter } = require('../controllers/contactController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.post('/', optionalAuth, [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message must be at least 10 characters'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
], submitContact);

router.post('/newsletter', [
  body('email').isEmail().withMessage('Valid email is required'),
], subscribeNewsletter);

router.get('/admin', protect, adminOnly, getContacts);
router.put('/admin/:id', protect, adminOnly, updateContactStatus);

module.exports = router;