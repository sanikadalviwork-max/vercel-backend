// cart.js
const router = require('express').Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Cart stored in session for simplicity; can be moved to DB model
let carts = {}; // userId -> items[]

router.get('/', auth, (req, res) => {
  res.json(carts[req.user.id] || []);
});

router.post('/add', auth, (req, res) => {
  const { productId, name, price, image, qty = 1 } = req.body;
  if (!carts[req.user.id]) carts[req.user.id] = [];
  const existing = carts[req.user.id].find(i => i.productId === productId);
  if (existing) existing.qty += qty;
  else carts[req.user.id].push({ productId, name, price, image, qty });
  res.json(carts[req.user.id]);
});

router.put('/update', auth, (req, res) => {
  const { productId, qty } = req.body;
  if (!carts[req.user.id]) return res.json([]);
  if (qty <= 0) carts[req.user.id] = carts[req.user.id].filter(i => i.productId !== productId);
  else { const item = carts[req.user.id].find(i => i.productId === productId); if (item) item.qty = qty; }
  res.json(carts[req.user.id]);
});

router.delete('/remove/:productId', auth, (req, res) => {
  if (carts[req.user.id]) carts[req.user.id] = carts[req.user.id].filter(i => i.productId !== req.params.productId);
  res.json(carts[req.user.id] || []);
});

router.delete('/clear', auth, (req, res) => {
  carts[req.user.id] = [];
  res.json([]);
});

module.exports = router;
