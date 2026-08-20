const Contact = require('../models/Contact');
const Newsletter = require('../models/Newsletter');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const { validationResult } = require('express-validator');

const submitContact = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ success: false, message: errors.array()[0].msg });

    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({ name, email, phone, subject, message, userId: req.user?.id || null });

    const { subject: rs, html: rh } = emailTemplates.contactAutoReply(name, subject);
    await sendEmail({ to: email, subject: rs, html: rh });

    const { subject: as, html: ah } = emailTemplates.contactAdminNotify(contact);
    await sendEmail({ to: process.env.ADMIN_EMAIL, subject: as, html: ah });

    res.status(201).json({ success: true, message: "Message sent! We'll get back to you within 24-48 hours." });
  } catch (error) { next(error); }
};

const getContacts = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [contacts, total] = await Promise.all([
      Contact.find(query).sort('-createdAt').skip(skip).limit(parseInt(limit)),
      Contact.countDocuments(query),
    ]);
    res.json({ success: true, data: contacts, pagination: { total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Status updated', data: contact });
  } catch (error) { next(error); }
};

const subscribeNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;
    await Newsletter.findOneAndUpdate({ email }, { email, isActive: true }, { upsert: true, new: true });
    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) { next(error); }
};

module.exports = { submitContact, getContacts, updateContactStatus, subscribeNewsletter };