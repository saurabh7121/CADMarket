const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Order = require('../models/Order');
const { protectUser } = require('../middleware/userAuth');

const signToken = (id) =>
  jwt.sign({ id, role: 'user' }, process.env.JWT_SECRET, {
    expiresIn: `${process.env.JWT_EXPIRES_IN || 7}d`,
  });

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const user = await User.create({ name, email, phone: phone || '' , password });

    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is disabled' });
    }

    const token = signToken(user._id);
    res.json({
      token,
      user: { _id: user._id, name: user.name, email: user.email, phone: user.phone },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/me  — protected
router.get('/me', protectUser, (req, res) => {
  const { _id, name, email, phone, createdAt } = req.user;
  res.json({ user: { _id, name, email, phone, createdAt } });
});

// GET /api/users/orders — user's own order history
router.get('/orders', protectUser, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (+page - 1) * +limit;

    const query = { userId: req.user._id, status: 'completed' };
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(+limit)
        .select('-items.cadFilePublicId'), // Don't expose internal IDs
      Order.countDocuments(query),
    ]);

    res.json({ orders, total, page: +page, pages: Math.ceil(total / +limit) });
  } catch (err) {
    console.error('User orders error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PATCH /api/users/profile — update profile
router.patch('/profile', protectUser, async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};
    if (name) updates.name = name.trim();
    if (phone !== undefined) updates.phone = phone.trim();

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: { _id: user._id, name: user.name, email: user.email, phone: user.phone } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
