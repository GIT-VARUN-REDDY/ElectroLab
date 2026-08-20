const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized, no token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === 'admin' && decoded.isAdminEnv) {
      req.user = { id: 'admin', name: 'Admin', email: process.env.ADMIN_EMAIL, role: 'admin', isVerified: true, isBlocked: false };
      return next();
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success: false, message: 'User not found' });
    if (user.isBlocked) return res.status(403).json({ success: false, message: 'Your account has been blocked' });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'admin' && decoded.isAdminEnv) {
        req.user = { id: 'admin', role: 'admin' };
      } else {
        req.user = await User.findById(decoded.id).select('-password');
      }
    }
    next();
  } catch {
    next();
  }
};

module.exports = { protect, optionalAuth };