const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// All admin stats routes require authentication

// GET /api/admin/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const [orders, products] = await Promise.all([
      Order.find({ status: 'completed' }),
      Product.countDocuments({ isActive: true }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
    const totalDownloads = orders.reduce((sum, o) => sum + (o.downloadCount || 0), 0);

    // Compare current month vs last month
    const now = new Date();
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthOrders = orders.filter(o => o.createdAt >= thisMonthStart);
    const lastMonthOrders = orders.filter(o => o.createdAt >= lastMonthStart && o.createdAt < thisMonthStart);

    const thisRevenue = thisMonthOrders.reduce((s, o) => s + o.totalAmount, 0);
    const lastRevenue = lastMonthOrders.reduce((s, o) => s + o.totalAmount, 0);
    const revenueTrend = lastRevenue === 0 ? 100 : Math.round(((thisRevenue - lastRevenue) / lastRevenue) * 100);
    const ordersTrend = lastMonthOrders.length === 0 ? 100 : Math.round(((thisMonthOrders.length - lastMonthOrders.length) / lastMonthOrders.length) * 100);

    res.json({
      totalRevenue, totalOrders: orders.length, totalProducts: products,
      totalDownloads, revenueTrend, ordersTrend,
    });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/revenue-chart
router.get('/revenue-chart', protect, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const orders = await Order.find({
      status: 'completed',
      createdAt: { $gte: thirtyDaysAgo },
    }).select('totalAmount createdAt');

    // Group by date
    const grouped = {};
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      const key = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      grouped[key] = 0;
    }

    orders.forEach(o => {
      const key = o.createdAt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
      if (grouped[key] !== undefined) grouped[key] += o.totalAmount;
    });

    const data = Object.entries(grouped).map(([date, revenue]) => ({ date, revenue }));
    res.json({ data });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/top-products
router.get('/top-products', protect, async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ downloads: -1 })
      .limit(5)
      .select('title downloads category');
    res.json({ products });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// GET /api/admin/customers
router.get('/customers', protect, async (req, res) => {
  try {
    const { search } = req.query;
    const matchStage = { status: 'completed' };
    if (search) {
      matchStage.$or = [
        { 'billing.fullName': { $regex: search, $options: 'i' } },
        { 'billing.email': { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Order.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$billing.email',
          fullName: { $first: '$billing.fullName' },
          email: { $first: '$billing.email' },
          phone: { $first: '$billing.phone' },
          orderCount: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 100 },
    ]);

    res.json({ customers });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

module.exports = router;
