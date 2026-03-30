const router = require('express').Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const Product = require('../models/Product');

router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  try {
    const { productId, rating, title, body, userName } = req.body;
    const review = await Review.create({ product: productId, user: req.user.id, rating, title, body, userName });
    // Update product rating
    const reviews = await Review.find({ product: productId });
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(productId, { rating: avg.toFixed(1), reviewCount: reviews.length });
    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
