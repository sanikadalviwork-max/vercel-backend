const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    qty: Number,
    image: String
  }],
  address: {
    name: String, phone: String, line1: String,
    line2: String, city: String, state: String, pincode: String
  },
  total: { type: Number, required: true },
  status: { type: String, enum: ['placed', 'confirmed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'], default: 'placed' },
  paymentMethod: { type: String, default: 'COD' },
  orderId: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', function(next) {
  if (!this.orderId) this.orderId = 'LME-' + Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);
