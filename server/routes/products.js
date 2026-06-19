const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products
router.get('/', async (req, res) => {
  try {
    const {
      page = 1, limit = 12, sort = 'newest',
      search, category, minPrice, maxPrice,
    } = req.query;

    const query = { isActive: true };

    if (search) {
      query.$text = { $search: search };
    }
    if (category && category !== 'All') {
      query.category = category;
    }
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = +minPrice;
      if (maxPrice) query.price.$lte = +maxPrice;
    }

    const sortMap = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      popular: { downloads: -1 },
    };

    const skip = (Math.max(+page, 1) - 1) * Math.min(+limit, 100);
    const [products, total, maxPriceResult] = await Promise.all([
      Product.find(query).sort(sortMap[sort] || { createdAt: -1 }).skip(skip).limit(Math.min(+limit, 100)),
      Product.countDocuments(query),
      Product.findOne({ isActive: true }).sort({ price: -1 }).select('price'),
    ]);

    res.json({
      products,
      total,
      page: +page,
      totalPages: Math.ceil(total / +limit),
      maxPrice: maxPriceResult?.price || 50000,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ product });
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
