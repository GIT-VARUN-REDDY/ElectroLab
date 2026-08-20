const User = require('../models/User');
const { generateJWT, generateRandomToken } = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');
const emailTemplates = require('../utils/emailTemplates');
const Analytics = require('../models/Analytics');

const updateDailyAnalytics = async (field) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await Analytics.findOneAndUpdate(
      { date: today },
      { $inc: { [field]: 1 } },
      { upsert: true, new: true }
    );
  } catch (err) {
    console.error('Analytics error:', err.message);
  }
};

const signup = async (req, res) => {
  console.log('📝 Signup called with body:', JSON.stringify(req.body));
  try {
    const { name, email, password, phone, college, course } = req.body;

    if (!name || !email || !password) {
      console.log('❌ Signup: missing fields');
      return res.status(400).json({ success: false, message: 'Name, email and password are required' });
    }

    console.log('🔍 Checking if email exists:', email);
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.log('❌ Signup: email already registered:', email);
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    console.log('✅ Email is new, creating user...');
    const verificationToken = generateRandomToken();
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const newUser = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      college: college || '',
      course: course || '',
      verificationToken,
      verificationTokenExpiry,
    });

    console.log('✅ User created with ID:', newUser._id);

    console.log('📧 Attempting to send verification email...');
    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      console.log('📧 Verification URL:', verificationUrl);
      const { subject, html } = emailTemplates.verifyEmail(name, verificationUrl);
      await sendEmail({ to: email, subject, html });
      console.log('✅ Verification email sent successfully');
    } catch (emailErr) {
      console.error('❌ Email send failed (non-fatal):', emailErr.message);
    }

    await updateDailyAnalytics('newUsers');

    return res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify your account.',
    });
  } catch (error) {
    console.error('❌ Signup FULL error:', error);
    console.error('❌ Signup error message:', error.message);
    return res.status(500).json({ success: false, message: error.message || 'Signup failed' });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ success: false, message: 'Token is required' });
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired verification token' });
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();
    return res.json({ success: true, message: 'Email verified successfully! You can now log in.' });
  } catch (error) {
    console.error('VerifyEmail error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  console.log('🔐 Login called for:', req.body.email);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    const ip = req.ip || req.connection.remoteAddress;
    const device = req.headers['user-agent'] || 'Unknown';

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = generateJWT({ id: 'admin', role: 'admin', isAdminEnv: true, email: process.env.ADMIN_EMAIL });
      return res.json({
        success: true,
        message: 'Admin login successful',
        token,
        user: { id: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin', isVerified: true, avatar: '' },
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password' });

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Please verify your email before logging in', needsVerification: true });
    }
    if (user.isBlocked) {
      return res.status(403).json({ success: false, message: 'Your account has been blocked.' });
    }

    user.lastLogin = new Date();
    user.loginHistory.unshift({ timestamp: new Date(), ip, device });
    if (user.loginHistory.length > 10) user.loginHistory = user.loginHistory.slice(0, 10);
    await user.save();
    await updateDailyAnalytics('visits');

    const token = generateJWT({ id: user._id, role: user.role });
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        avatar: user.avatar,
        phone: user.phone,
        college: user.college,
        course: user.course,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = generateRandomToken();
    await User.findByIdAndUpdate(user._id, {
      resetPasswordToken: resetToken,
      resetPasswordTokenExpiry: new Date(Date.now() + 60 * 60 * 1000),
    });

    try {
      const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
      const { subject, html } = emailTemplates.resetPassword(user.name, resetUrl);
      await sendEmail({ to: email, subject, html });
    } catch (emailErr) {
      console.error('Reset email error:', emailErr.message);
    }

    return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
  } catch (error) {
    console.error('ForgotPassword error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and password are required' });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiry: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpiry = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    console.error('ResetPassword error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const resendVerification = async (req, res) => {
  console.log('📧 ResendVerification called for:', req.body.email);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: true, message: 'If registered, a verification email has been sent.' });
    if (user.isVerified) return res.status(400).json({ success: false, message: 'Email already verified' });

    const verificationToken = generateRandomToken();
    await User.findByIdAndUpdate(user._id, {
      verificationToken,
      verificationTokenExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    try {
      const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
      const { subject, html } = emailTemplates.verifyEmail(user.name, verificationUrl);
      await sendEmail({ to: email, subject, html });
      console.log('✅ Resend verification email sent');
    } catch (emailErr) {
      console.error('❌ Resend email error:', emailErr.message);
    }

    return res.json({ success: true, message: 'Verification email sent.' });
  } catch (error) {
    console.error('ResendVerification error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (req.user.role === 'admin' && req.user.id === 'admin') {
      return res.json({ success: true, user: req.user });
    }
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { signup, verifyEmail, login, forgotPassword, resetPassword, resendVerification, getMe };