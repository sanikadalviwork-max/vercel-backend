const router = require('express').Router();
const Product = require('../models/Product');

// Get all products with filter/search/sort
router.get('/', async (req, res) => {
  try {
    const { category, search, sort, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    let query = {};
    if (category && category !== 'all') query.category = category;
    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice || maxPrice) query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);

    let sortObj = {};
    if (sort === 'price_asc') sortObj = { price: 1 };
    else if (sort === 'price_desc') sortObj = { price: -1 };
    else if (sort === 'rating') sortObj = { rating: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else sortObj = { isBestseller: -1, createdAt: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortObj)
      .skip((page - 1) * limit).limit(Number(limit));
    res.json({ products, total, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Seed products (run once)
router.post('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      { name: 'Magenta Mist Toner', price: 1450, originalPrice: 1800, discount: 19, category: 'skincare', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600'], rating: 4.5, reviewCount: 128, isBestseller: true, description: 'A refreshing pH-balancing toner with rose water and niacinamide. Preps skin for better absorption of serums.', howToUse: 'Apply on cleansed face using a cotton pad morning and night.', tags: ['toner', 'hydrating', 'skincare'] },
      { name: 'Electric Velvet Blush', price: 1800, originalPrice: 2200, discount: 18, category: 'face', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'], rating: 4.7, reviewCount: 89, isBestseller: true, description: 'Buildable velvet-finish blush in ultra-pigmented shades.', howToUse: 'Swirl brush, tap off excess, apply to apples of cheeks.', tags: ['blush', 'face', 'makeup'] },
      { name: 'Violet Night Serum', price: 3500, originalPrice: 4200, discount: 16, category: 'skincare', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'], rating: 4.8, reviewCount: 214, isBestseller: true, description: 'Retinol + Peptide overnight repair serum. Wakes you up with plumper, firmer skin.', howToUse: 'Apply 2-3 drops on face after toner. Night use only. Follow with moisturizer.', tags: ['serum', 'anti-aging', 'skincare'] },
      { name: 'Matte Plum Lipstick', price: 850, originalPrice: 1000, discount: 15, category: 'lips', images: ['https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600'], rating: 4.4, reviewCount: 302, description: 'Long-lasting 16HR matte formula in a deep plum shade.', howToUse: 'Apply from center outward. Layer for deeper color.', tags: ['lipstick', 'matte', 'lips'] },
      { name: 'Neon Gloss Glaze', price: 1200, originalPrice: 1400, discount: 14, category: 'lips', images: ['https://images.unsplash.com/photo-1590156221122-c748e78f2a7a?w=600'], rating: 4.3, reviewCount: 175, description: 'Non-sticky high-shine lip gloss with plumping peptides.', howToUse: 'Apply to bare lips or over lipstick for extra glam.', tags: ['gloss', 'lips', 'plumping'] },
      { name: 'Chrome Eye Pigment', price: 950, originalPrice: 1200, discount: 20, category: 'eyes', images: ['https://images.unsplash.com/photo-1503236123135-0835612d7d32?w=600'], rating: 4.6, reviewCount: 143, description: 'Ultra-metallic loose eye pigment for editorial looks.', howToUse: 'Apply with damp brush for intense payoff. Use dry for subtle wash.', tags: ['eyeshadow', 'metallic', 'eyes'], isNew: true },
      { name: 'Strobe Liquid Gold', price: 2100, originalPrice: 2500, discount: 16, category: 'face', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'], rating: 4.9, reviewCount: 88, description: 'Liquid highlighter with real gold micro-particles for otherworldly glow.', howToUse: 'Mix with foundation or apply directly to high points of face.', tags: ['highlighter', 'glow', 'face'], isBestseller: true },
      { name: 'Silk Finish Primer', price: 1650, originalPrice: 2000, discount: 17, category: 'face', images: ['https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=600'], rating: 4.5, reviewCount: 201, description: 'Pore-minimizing primer with hyaluronic acid and silk proteins.', howToUse: 'Apply after skincare, before foundation. Let sit 1 min.', tags: ['primer', 'pores', 'face'] },
      { name: 'Hydra-Glow Foundation', price: 2800, originalPrice: 3400, discount: 17, category: 'face', images: ['https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=600'], rating: 4.7, reviewCount: 318, description: '24HR hydrating foundation with SPF 30. 30 shades available.', howToUse: 'Apply with brush or sponge. Build coverage as needed.', tags: ['foundation', 'spf', 'face'], isBestseller: true },
      { name: 'Cyber Blue Liner', price: 750, originalPrice: 900, discount: 16, category: 'eyes', images: ['https://images.unsplash.com/photo-1621333104435-a119020ca60b?w=600'], rating: 4.2, reviewCount: 267, description: 'Smudge-proof gel liner with precision tip. Vibrant cyber blue.', howToUse: 'Start at inner corner, glide outward in one stroke.', tags: ['liner', 'eyes', 'gel'], isNew: true },
      { name: 'Peach Quartz Gloss', price: 1100, originalPrice: 1350, discount: 18, category: 'lips', images: ['https://images.unsplash.com/photo-1631214500115-5989a608f331?w=600'], rating: 4.4, reviewCount: 156, description: 'Sheer peachy-pink gloss that gives your lips a kissed glow.', howToUse: 'Apply generously, blot for diffused look.', tags: ['gloss', 'lips', 'sheer'] },
      { name: 'Rose Clay Mask', price: 1950, originalPrice: 2400, discount: 18, category: 'skincare', images: ['https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600'], rating: 4.6, reviewCount: 192, description: 'Deep-cleansing kaolin clay mask with rose extract and AHA.', howToUse: 'Apply even layer on face. Leave 10-15 min. Rinse off.', tags: ['mask', 'clay', 'skincare'] },
      { name: 'Volumizing Onyx Mascara', price: 1300, originalPrice: 1600, discount: 18, category: 'eyes', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'], rating: 4.5, reviewCount: 389, description: 'Jet-black mascara with castor oil for length and volume.', howToUse: 'Wiggle wand at base, sweep through lashes. Layer for drama.', tags: ['mascara', 'eyes', 'volume'], isBestseller: true },
      { name: 'Iridescent Bronzer', price: 2400, originalPrice: 2900, discount: 17, category: 'face', images: ['https://images.unsplash.com/photo-1619451334792-150fd785ee74?w=600'], rating: 4.8, reviewCount: 134, description: 'Multi-dimensional pressed bronzer with iridescent pearl.', howToUse: 'Swirl large brush, apply to temple, cheekbones, jawline.', tags: ['bronzer', 'contour', 'face'] },
      { name: 'Cactus Flower Cleanser', price: 1250, originalPrice: 1500, discount: 16, category: 'skincare', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'], rating: 4.4, reviewCount: 223, description: 'Gentle foaming cleanser with cactus flower extract and ceramides.', howToUse: 'Lather with water, massage in circular motions. Rinse.', tags: ['cleanser', 'gentle', 'skincare'] },
      { name: 'Setting Spray Aura', price: 1500, originalPrice: 1800, discount: 16, category: 'face', images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'], rating: 4.6, reviewCount: 167, description: 'Long-wear setting spray with dewy finish. Infused with coconut water.', howToUse: 'Hold 12 inches away. Spray 2-3 times in X and T motion.', tags: ['setting spray', 'finish', 'face'] },
      { name: 'Glow Drops Elixir', price: 2200, originalPrice: 2800, discount: 21, category: 'skincare', images: ['https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600'], rating: 4.7, reviewCount: 98, description: 'Lightweight vitamin C + hyaluronic acid glow drops for radiant skin all day.', howToUse: 'Mix 2-3 drops into moisturizer or apply alone before SPF.', tags: ['vitamin C', 'glow', 'skincare'], isNew: true },
      { name: 'Nude Velvet Lip Liner', price: 650, originalPrice: 800, discount: 18, category: 'lips', images: ['https://images.unsplash.com/photo-1599751264009-691f5736e81c?w=600'], rating: 4.3, reviewCount: 211, description: 'Creamy, long-wear lip liner in 12 nudes. Prevents feathering and lasts 12 hours.', howToUse: 'Outline lips, fill in for longer-lasting lipstick.', tags: ['lip liner', 'nude', 'lips'] },
      { name: 'Charcoal Detox Mask', price: 1750, originalPrice: 2100, discount: 16, category: 'skincare', images: ['https://images.unsplash.com/photo-1559181567-c3190e81f73f?w=600'], rating: 4.5, reviewCount: 176, description: 'Activated charcoal peel-off mask that extracts blackheads and tightens pores.', howToUse: 'Apply thick layer, leave 20 min until dry, peel off.', tags: ['charcoal', 'peel-off', 'skincare'] },
      { name: 'Brow Sculpt Pomade', price: 890, originalPrice: 1100, discount: 19, category: 'eyes', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'], rating: 4.6, reviewCount: 143, description: 'Waterproof brow pomade for defined, natural-looking brows. 6 shades.', howToUse: 'Use angled brush, apply with feather-like strokes.', tags: ['brows', 'pomade', 'eyes'], isNew: true },
      { name: 'Oud Bloom Perfume', price: 4200, originalPrice: 5000, discount: 16, category: 'fragrance', images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'], rating: 4.9, reviewCount: 67, description: 'A rich oriental fragrance with oud, rose, and sandalwood. Lasts 8-10 hours.', howToUse: 'Spray on pulse points — wrists, neck, behind ears.', tags: ['perfume', 'oud', 'fragrance'], isBestseller: true },
      { name: 'Satin Lip Treatment', price: 980, originalPrice: 1200, discount: 18, category: 'lips', images: ['https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600'], rating: 4.4, reviewCount: 188, description: 'Overnight lip sleeping mask with shea butter and vitamin E for plump, soft lips.', howToUse: 'Apply a generous layer before bed. Wake up to baby-soft lips.', tags: ['lip mask', 'treatment', 'lips'] },
      { name: 'Glass Skin Essence', price: 2650, originalPrice: 3200, discount: 17, category: 'skincare', images: ['https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600'], rating: 4.8, reviewCount: 142, description: 'Korean-inspired glass skin essence with 5 types of hyaluronic acid and mugwort.', howToUse: 'Pat gently into clean skin after toner, before serum.', tags: ['essence', 'glass skin', 'skincare'], isNew: true },
      { name: 'Contour Stick Duo', price: 1580, originalPrice: 1900, discount: 16, category: 'face', images: ['https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600'], rating: 4.5, reviewCount: 209, description: 'Double-ended contour + highlight stick for sculpted cheekbones on the go.', howToUse: 'Blend dark end under cheekbones, light end on top. Blend well.', tags: ['contour', 'highlight', 'face'] },
      { name: 'Rose Gold Eyeshadow Palette', price: 2950, originalPrice: 3600, discount: 18, category: 'eyes', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600'], rating: 4.7, reviewCount: 256, description: '12-pan rose gold palette with mattes, shimmers, and glitters for every look.', howToUse: 'Apply light shades on lid, medium in crease, dark in outer V.', tags: ['eyeshadow palette', 'rose gold', 'eyes'], isBestseller: true },
      { name: 'Pore-Refining SPF Moisturiser', price: 1890, originalPrice: 2300, discount: 17, category: 'skincare', images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'], rating: 4.6, reviewCount: 312, description: 'Lightweight SPF 50 moisturizer that blurs pores and controls shine for 8 hours.', howToUse: 'Apply as last step of morning skincare. Re-apply every 2 hours in sun.', tags: ['spf', 'moisturizer', 'skincare'], isBestseller: true },
      { name: 'Pastel Rainbow Liner Set', price: 1450, originalPrice: 1750, discount: 17, category: 'eyes', images: ['https://images.unsplash.com/photo-1621333104435-a119020ca60b?w=600'], rating: 4.3, reviewCount: 119, description: 'Set of 6 pastel gel liners — lavender, mint, pink, peach, sky blue, and lemon.', howToUse: 'Use for graphic liner looks or as eyeshadow wash.', tags: ['liner set', 'pastel', 'eyes'], isNew: true },
      { name: 'Lip Comfort Oil', price: 1100, originalPrice: 1350, discount: 18, category: 'lips', images: ['https://images.unsplash.com/photo-1590156221122-c748e78f2a7a?w=600'], rating: 4.5, reviewCount: 233, description: 'Nourishing lip oil with rosehip and jojoba for glossy, plumped lips.', howToUse: 'Apply throughout the day as needed. Can layer over lipstick.', tags: ['lip oil', 'gloss', 'lips'] },
      { name: 'Deep Cleansing Brush', price: 1200, originalPrice: 1500, discount: 20, category: 'tools', images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=600'], rating: 4.4, reviewCount: 87, description: 'Silicone facial cleansing brush with 3 modes for deep pore cleansing.', howToUse: 'Apply cleanser to face, turn on brush, massage in circles for 1 min.', tags: ['brush', 'cleansing', 'tools'], isNew: true },
      { name: 'Jasmine Body Mist', price: 890, originalPrice: 1100, discount: 19, category: 'fragrance', images: ['https://images.unsplash.com/photo-1541643600914-78b084683702?w=600'], rating: 4.2, reviewCount: 154, description: 'Light, refreshing jasmine and white tea body mist. Perfect for everyday wear.', howToUse: 'Spray on body after shower or throughout the day.', tags: ['body mist', 'jasmine', 'fragrance'] },
      { name: 'Retractable Kabuki Brush', price: 750, originalPrice: 950, discount: 21, category: 'tools', images: ['https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600'], rating: 4.5, reviewCount: 196, description: 'Travel-friendly retractable kabuki brush with ultra-soft synthetic bristles.', howToUse: 'Swirl into powder, tap off excess, buff in circular motions.', tags: ['brush', 'kabuki', 'tools'] },
      { name: 'Peptide Eye Cream', price: 2100, originalPrice: 2600, discount: 19, category: 'skincare', images: ['https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=600'], rating: 4.7, reviewCount: 178, description: 'Anti-puff, brightening eye cream with caffeine and tripeptide complex.', howToUse: 'Tap gently around eye area morning and night using ring finger.', tags: ['eye cream', 'peptide', 'skincare'], isBestseller: true },
    ];
    await Product.insertMany(products);
    res.json({ message: `${products.length} products seeded!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
