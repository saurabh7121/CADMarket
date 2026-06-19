const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { cloudinary } = require('../config/cloudinary');

// GET /api/orders/:orderId
router.get('/:orderId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'completed') return res.status(403).json({ message: 'Order not completed' });

    // Don't expose internal publicIds to client
    const safeOrder = order.toObject();
    safeOrder.items = safeOrder.items.map(({ cadFilePublicId, ...item }) => item);

    res.json({ order: safeOrder });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/orders — Admin only (called from admin panel without auth check here, protected in app mount)
// but with search
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { 'billing.fullName': { $regex: search, $options: 'i' } },
        { 'billing.email': { $regex: search, $options: 'i' } },
      ];
    }
    const skip = (+page - 1) * +limit;
    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(+limit),
      Order.countDocuments(query),
    ]);
    res.json({ orders, total });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/orders/:orderId/download/:productId
router.get('/:orderId/download/:productId', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.status !== 'completed') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const item = order.items.find(i => i.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Product not in this order' });

    if (!item.cadFilePublicId) {
      return res.status(404).json({ message: 'File not available' });
    }

    // Generate a signed URL valid for 5 minutes
    const signedUrl = cloudinary.utils.private_download_url(
      item.cadFilePublicId,
      'zip',
      {
        resource_type: 'raw',
        expires_at: Math.floor(Date.now() / 1000) + 300, // 5 min
        attachment: true,
      }
    );

    order.downloadCount = (order.downloadCount || 0) + 1;
    await order.save();

    res.json({ url: signedUrl, filename: `${item.title}.zip` });
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ message: 'Failed to generate download link' });
  }
});

// GET /api/orders/:orderId/download-all
router.get('/:orderId/download-all', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order || order.status !== 'completed') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // For multi-file download, generate signed URLs for each file
    // Return first file if only one item, otherwise client will handle multiple
    if (order.items.length === 1) {
      const item = order.items[0];
      const signedUrl = cloudinary.utils.private_download_url(
        item.cadFilePublicId, 'zip',
        { resource_type: 'raw', expires_at: Math.floor(Date.now() / 1000) + 300, attachment: true }
      );
      return res.json({ url: signedUrl });
    }

    // Multiple files: return all signed URLs
    const urls = order.items.map(item => ({
      title: item.title,
      url: item.cadFilePublicId
        ? cloudinary.utils.private_download_url(
            item.cadFilePublicId, 'zip',
            { resource_type: 'raw', expires_at: Math.floor(Date.now() / 1000) + 300, attachment: true }
          )
        : null,
    })).filter(u => u.url);

    res.json({ urls, multiple: true });
  } catch (err) {
    console.error('Download all error:', err);
    res.status(500).json({ message: 'Failed to generate download links' });
  }
});

module.exports = router;
