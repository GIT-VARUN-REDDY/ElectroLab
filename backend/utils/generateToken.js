const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateJWT = (payload, expiresIn = process.env.JWT_EXPIRE) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const generateRandomToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = { generateJWT, generateRandomToken };