const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');
const { cloudinary, uploadProductFiles } = require('../config/cloudinary');

// All admin product routes require authentication

// GET /api/admin/products (admin can see inactive too)
router.get('/', protect, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ products });
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// POST /api/admin/products
router.post('/', protect, uploadProductFiles, async (req, res) => {
  try {
    const { title, description, category, price, fileFormats, isFeatured } = req.body;
    if (!req.uploadedThumbnail) return res.status(400).json({ message: 'Thumbnail is required' });
    if (!req.uploadedCad) return res.status(400).json({ message: 'CAD file is required' });

    const product = new Product({
      title, description, category,
      price: +price,
      fileFormats: fileFormats ? JSON.parse(fileFormats) : [],
      isFeatured: isFeatured === 'true' || isFeatured === true,
      thumbnail: req.uploadedThumbnail.url,
      thumbnailPublicId: req.uploadedThumbnail.publicId,
      previewImages: req.uploadedPreviews?.map(p => p.url) || [],
      previewImagePublicIds: req.uploadedPreviews?.map(p => p.publicId) || [],
      cadFile: req.uploadedCad.url,
      cadFilePublicId: req.uploadedCad.publicId,
    });

    await product.save();
    res.status(201).json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id
router.put('/:id', protect, uploadProductFiles, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const { title, description, category, price, fileFormats, isFeatured } = req.body;
    if (title) product.title = title;
    if (description) product.description = description;
    if (category) product.category = category;
    if (price) product.price = +price;
    if (fileFormats) product.fileFormats = JSON.parse(fileFormats);
    if (isFeatured !== undefined) {
      product.isFeatured = isFeatured === 'true' || isFeatured === true;
    }

    if (req.uploadedThumbnail) {
      // Delete old thumbnail from Cloudinary
      if (product.thumbnailPublicId) {
        await cloudinary.uploader.destroy(product.thumbnailPublicId).catch(() => {});
      }
      product.thumbnail = req.uploadedThumbnail.url;
      product.thumbnailPublicId = req.uploadedThumbnail.publicId;
    }

    if (req.uploadedPreviews?.length) {
      // Delete old previews
      for (const pid of product.previewImagePublicIds || []) {
        await cloudinary.uploader.destroy(pid).catch(() => {});
      }
      product.previewImages = req.uploadedPreviews.map(p => p.url);
      product.previewImagePublicIds = req.uploadedPreviews.map(p => p.publicId);
    }

    if (req.uploadedCad) {
      if (product.cadFilePublicId) {
        await cloudinary.uploader.destroy(product.cadFilePublicId, { resource_type: 'raw' }).catch(() => {});
      }
      product.cadFile = req.uploadedCad.url;
      product.cadFilePublicId = req.uploadedCad.publicId;
    }

    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Cleanup Cloudinary files
    if (product.thumbnailPublicId) {
      await cloudinary.uploader.destroy(product.thumbnailPublicId).catch(() => {});
    }
    for (const pid of product.previewImagePublicIds || []) {
      await cloudinary.uploader.destroy(pid).catch(() => {});
    }
    if (product.cadFilePublicId) {
      await cloudinary.uploader.destroy(product.cadFilePublicId, { resource_type: 'raw' }).catch(() => {});
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch { res.status(500).json({ message: 'Failed to delete' }); }
});

// PATCH /api/admin/products/:id/toggle-featured
router.patch('/:id/toggle-featured', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    product.isFeatured = !product.isFeatured;
    await product.save();
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: 'Failed to toggle featured status' });
  }
});

module.exports = router;
