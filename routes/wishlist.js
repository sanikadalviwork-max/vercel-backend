const router = require('express').Router();
const auth = require('../middleware/auth');

let wishlists = {};

router.get('/', auth, (req, res) => res.json(wishlists[req.user.id] || []));

router.post('/toggle', auth, (req, res) => {
  const { productId, name, price, image } = req.body;
  if (!wishlists[req.user.id]) wishlists[req.user.id] = [];
  const idx = wishlists[req.user.id].findIndex(i => i.productId === productId);
  if (idx > -1) wishlists[req.user.id].splice(idx, 1);
  else wishlists[req.user.id].push({ productId, name, price, image });
  res.json(wishlists[req.user.id]);
});

module.exports = router;
