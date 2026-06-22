const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes — requires a valid user JWT
 */
const protectUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'user') {
      return res.status(401).json({ message: 'Not a user token' });
    }
    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      return res.status(401).json({ message: 'User not found or inactive' });
    }
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Token expired or invalid' });
  }
};

/**
 * Optionally attach user to req — doesn't block if no token
 */
const optionalUser = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.role === 'user') {
        const user = await User.findById(decoded.id);
        if (user && user.isActive) req.user = user;
      }
    }
  } catch { /* ignore */ }
  next();
};

module.exports = { protectUser, optionalUser };
