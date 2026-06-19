const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');
const Order = require('../models/Order');
const Product = require('../models/Product');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// POST /api/payments/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { items, billing } = req.body;
    if (!items?.length || !billing) {
      return res.status(400).json({ message: 'Items and billing are required' });
    }

    // Validate products from DB (trust server-side prices)
    const productIds = items.map(i => i.productId);
    const products = await Product.find({ _id: { $in: productIds }, isActive: true });

    if (products.length !== items.length) {
      return res.status(400).json({ message: 'Some products are unavailable' });
    }

    const totalAmount = products.reduce((sum, p) => sum + p.price, 0);
    const amountInPaise = Math.round(totalAmount * 100);

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
    });

    // Create pending order in DB
    const order = new Order({
      items: products.map(p => ({
        productId: p._id,
        title: p.title,
        category: p.category,
        price: p.price,
        thumbnail: p.thumbnail,
        cadFilePublicId: p.cadFilePublicId,
      })),
      billing,
      totalAmount,
      razorpayOrderId: razorpayOrder.id,
      status: 'pending',
    });

    await order.save();

    res.json({
      razorpayOrderId: razorpayOrder.id,
      orderId: order._id,
      amount: amountInPaise,
      currency: 'INR',
    });
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: 'Failed to create order' });
  }
});

// POST /api/payments/verify
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify Razorpay signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Payment signature verification failed' });
    }

    // Update order status
    const order = await Order.findOneAndUpdate(
      { _id: orderId, razorpayOrderId: razorpay_order_id },
      {
        paymentId: razorpay_payment_id,
        paymentSignature: razorpay_signature,
        status: 'completed',
      },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Increment download counts
    const productIds = order.items.map(i => i.productId);
    await Product.updateMany({ _id: { $in: productIds } }, { $inc: { downloads: 1 } });

    res.json({ success: true, orderId: order._id });
  } catch (err) {
    console.error('Verify error:', err);
    res.status(500).json({ message: 'Payment verification failed' });
  }
});

module.exports = router;
