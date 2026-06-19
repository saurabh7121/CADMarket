const express = require('express');
const router = express.Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email and message are required' });
    }

    // Here you'd typically send an email via nodemailer
    // For now, log and respond success
    console.log('[Contact]', { name, email, subject, message });

    res.json({ success: true, message: 'Message received' });
  } catch {
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
