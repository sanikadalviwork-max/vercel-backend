const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true, enum: ['skincare', 'makeup', 'lips', 'eyes', 'face', 'fragrance', 'tools'] },
  subcategory: { type: String },
  images: [String],
  rating: { type: Number, default: 4.0 },
  reviewCount: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  stockQty: { type: Number, default: 100 },
  tags: [String],
  ingredients: { type: String },
  howToUse: { type: String },
  isBestseller: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
