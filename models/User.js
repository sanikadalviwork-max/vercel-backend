const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  phone: { type: String },
  password: { type: String, required: true },
  avatar: { type: String, default: '' },
  addresses: [{
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    isDefault: { type: Boolean, default: false }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
