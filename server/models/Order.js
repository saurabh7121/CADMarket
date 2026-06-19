const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: String,
  category: String,
  price: Number,
  thumbnail: String,
  cadFilePublicId: String,  // For secure download generation
}, { _id: false });

const billingSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: String,
  city: String,
  state: String,
  pincode: String,
  country: { type: String, default: 'India' },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  items: [orderItemSchema],
  billing: billingSchema,
  totalAmount: { type: Number, required: true },
  razorpayOrderId: { type: String, required: true, unique: true },
  paymentId: { type: String },
  paymentSignature: { type: String },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  downloadCount: { type: Number, default: 0 },
}, { timestamps: true });

orderSchema.index({ 'billing.email': 1 });
orderSchema.index({ paymentId: 1 });

module.exports = mongoose.model('Order', orderSchema);
