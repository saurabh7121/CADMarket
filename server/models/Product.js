const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Mechanical', 'Architecture', 'Electronics', 'Automotive', 'Aerospace', 'Medical', 'Industrial'],
  },
  price: { type: Number, required: true, min: 0 },
  thumbnail: { type: String, required: true },      // Cloudinary URL
  thumbnailPublicId: { type: String },
  previewImages: [{ type: String }],                // Cloudinary URLs
  previewImagePublicIds: [{ type: String }],
  cadFile: { type: String },                         // Cloudinary secure URL
  cadFilePublicId: { type: String },
  fileFormats: [{ type: String }],                  // ['STEP', 'STL', ...]
  downloads: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

productSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Product', productSchema);
