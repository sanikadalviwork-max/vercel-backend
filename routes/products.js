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
 
// ✅ Seed route MUST be before /:id — changed to GET so you can run from browser
router.get('/seed', async (req, res) => {
  try {
    await Product.deleteMany({});
    const products = [
      // SKINCARE
      { name: 'Niacinamide 10% + Zinc Serum', price: 699, originalPrice: 999, discount: 30, category: 'skincare', images: ['https://images.pexels.com/photos/3685530/pexels-photo-3685530.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, reviewCount: 2847, isBestseller: true, description: 'A high-strength vitamin and mineral blemish formula with 10% Niacinamide and 1% Zinc. Reduces the appearance of blemishes and congested pores. Suitable for all skin types.', howToUse: 'Apply a few drops to face AM and PM after water-based serums. Always use SPF in the morning.', ingredients: 'Niacinamide (Vitamin B3) 10%, Zinc PCA 1%, Aqua, Pentylene Glycol, Glycerin', tags: ['niacinamide', 'serum', 'pores', 'skincare'] },
      { name: 'Hyaluronic Acid 2% + B5 Hydration Serum', price: 799, originalPrice: 1199, discount: 33, category: 'skincare', images: ['https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, reviewCount: 1923, isBestseller: true, description: 'A multi-depth hydration support serum with Hyaluronic Acid and Vitamin B5. Draws moisture into the skin and helps reduce dehydration lines.', howToUse: 'Apply to face AM and PM before creams. Pat in gently. Follow with moisturizer to lock in hydration.', tags: ['hyaluronic acid', 'hydration', 'serum', 'skincare'] },
      { name: 'SPF 50 PA++++ Sunscreen Gel', price: 549, originalPrice: 799, discount: 31, category: 'skincare', images: ['https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, reviewCount: 3521, isBestseller: true, description: 'Lightweight, non-greasy sunscreen gel with broad spectrum protection. No white cast. Water resistant formula perfect for Indian climate. Enriched with Vitamin E and Green Tea extract.', howToUse: 'Apply generously 15 minutes before sun exposure. Reapply every 2 hours.', tags: ['sunscreen', 'spf50', 'skincare', 'protection'] },
      { name: 'Vitamin C 15% Brightening Serum', price: 1299, originalPrice: 1799, discount: 27, category: 'skincare', images: ['https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.7, reviewCount: 1456, isNew: true, description: 'Brightening serum with stable Vitamin C, Ferulic Acid and Vitamin E. Reduces dark spots, evens skin tone and provides antioxidant protection. Dermatologist tested.', howToUse: 'Apply 3-4 drops to clean face in morning. Let absorb completely. Follow with SPF.', tags: ['vitamin c', 'brightening', 'serum', 'skincare'] },
      { name: 'Retinol 0.5% Advanced Night Serum', price: 1599, originalPrice: 2299, discount: 30, category: 'skincare', images: ['https://images.pexels.com/photos/3997990/pexels-photo-3997990.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.8, reviewCount: 987, isBestseller: true, description: 'Powerful anti-aging retinol serum that reduces fine lines, wrinkles and improves skin texture. Encapsulated retinol ensures slow release for minimum irritation.', howToUse: 'Use 2-3 nights per week initially. Apply pea-sized amount after cleansing. Always follow with moisturizer. ALWAYS wear SPF next morning.', tags: ['retinol', 'anti-aging', 'night serum', 'skincare'] },
      { name: 'Salicylic Acid 2% Face Wash', price: 399, originalPrice: 599, discount: 33, category: 'skincare', images: ['https://images.pexels.com/photos/3685523/pexels-photo-3685523.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, reviewCount: 2134, description: 'Gentle exfoliating face wash with 2% Salicylic Acid. Unclogs pores, controls oil and reduces acne. Soap-free formula with Aloe Vera.', howToUse: 'Wet face, apply small amount and massage in circular motions for 60 seconds. Rinse thoroughly. Use morning and night.', tags: ['salicylic acid', 'cleanser', 'acne', 'skincare'] },
      { name: 'Pure Rose Water Toner', price: 299, originalPrice: 449, discount: 33, category: 'skincare', images: ['https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.2, reviewCount: 4210, description: 'Pure steam-distilled rose water toner with Glycerin. pH balancing formula preps skin for better absorption. Alcohol-free, suitable for all skin types.', howToUse: 'After cleansing, spritz directly on face or apply with cotton pad. Let absorb before applying serums.', tags: ['rose water', 'toner', 'hydrating', 'skincare'] },
      { name: 'Ceramide Repair Moisturizer', price: 1099, originalPrice: 1599, discount: 31, category: 'skincare', images: ['https://images.pexels.com/photos/6621469/pexels-photo-6621469.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, reviewCount: 876, isNew: true, description: 'Rich barrier-repair moisturizer with 3 types of Ceramides, Peptides and Hyaluronic Acid. Restores and maintains skin barrier function. Non-comedogenic, fragrance-free.', howToUse: 'Apply to face and neck morning and night as the last step of skincare routine.', tags: ['ceramide', 'moisturizer', 'barrier repair', 'skincare'] },
      { name: 'Kaolin Clay Detox Face Mask', price: 599, originalPrice: 899, discount: 33, category: 'skincare', images: ['https://images.pexels.com/photos/3997993/pexels-photo-3997993.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, reviewCount: 1342, description: 'Deep cleansing clay mask with Kaolin, Bentonite and Charcoal. Draws out impurities, controls sebum and minimizes pores. Use twice a week.', howToUse: 'Apply even layer on clean, dry face. Leave for 10-15 minutes. Rinse with lukewarm water.', tags: ['clay mask', 'pores', 'detox', 'skincare'] },
      // LIPS
      { name: 'Matte Me Liquid Lipstick', price: 599, originalPrice: 799, discount: 25, category: 'lips', images: ['https://images.pexels.com/photos/2533266/pexels-photo-2533266.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, reviewCount: 5623, isBestseller: true, description: 'Ultra-smooth matte liquid lipstick with 16-hour wear. Available in 36 shades. Lightweight formula that does not crack or flake. Infused with Vitamin E.', howToUse: 'Apply from center of lips outward. Wait 60 seconds to set. Do not press lips together until dry.', tags: ['liquid lipstick', 'matte', 'lips', '16hr'] },
      { name: 'Glam Attack Glitter Lip Gloss', price: 449, originalPrice: 649, discount: 30, category: 'lips', images: ['https://images.pexels.com/photos/2697787/pexels-photo-2697787.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, reviewCount: 1876, isNew: true, description: 'High-shine glitter lip gloss with non-sticky formula. Packed with micro-glitter for a party-ready look. Plumping Hyaluronic Acid gives fuller looking lips.', howToUse: 'Apply directly from applicator to center of lips. Blend outward. Can be layered over lipstick.', tags: ['lip gloss', 'glitter', 'shine', 'lips'] },
      { name: 'Creamy Matte Bullet Lipstick', price: 499, originalPrice: 699, discount: 28, category: 'lips', images: ['https://images.pexels.com/photos/1749452/pexels-photo-1749452.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, reviewCount: 3241, isBestseller: true, description: 'Creamy matte lipstick with intense color and comfort. Enriched with Shea Butter and Jojoba Oil. 8-hour wear. 48 shades including Indian skin tone favorites.', howToUse: 'Apply directly on lips starting from cupid\'s bow. For precise lines, use a lip liner first.', tags: ['lipstick', 'creamy matte', 'shea butter', 'lips'] },
      { name: 'Lip Plumper Gloss with Peptides', price: 899, originalPrice: 1299, discount: 30, category: 'lips', images: ['https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.2, reviewCount: 892, isNew: true, description: 'Advanced lip plumping gloss with Peptides and Hyaluronic Acid. Visibly plumps lips within 30 minutes. 8 sheer shades with high gloss finish. No sting formula.', howToUse: 'Apply to clean lips. Reapply throughout day for maximum plumping effect.', tags: ['lip plumper', 'peptide', 'gloss', 'lips'] },
      // EYES
      { name: 'Kajal Kohl Eye Pencil', price: 249, originalPrice: 349, discount: 28, category: 'eyes', images: ['https://images.pexels.com/photos/3487443/pexels-photo-3487443.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, reviewCount: 8934, isBestseller: true, description: 'Intense black kohl kajal with smudge-proof waterproof formula. Lasts 24 hours. Ophthalmologist tested. Enriched with Almond Oil for nourishment.', howToUse: 'Apply along upper and lower lash line. For smoky look, smudge immediately after application. Remove with micellar water.', tags: ['kajal', 'kohl', 'eyes', 'waterproof'] },
      { name: '9-to-5 Volumizing Mascara', price: 699, originalPrice: 999, discount: 30, category: 'eyes', images: ['https://images.pexels.com/photos/3771828/pexels-photo-3771828.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, reviewCount: 4521, isBestseller: true, description: 'Buildable volume mascara with curved fiber brush. Clump-free, flake-free formula. Waterproof. Enriched with Castor Oil for lash conditioning.', howToUse: 'Wiggle wand at base of lashes and sweep upward. Apply 2-3 coats for dramatic volume.', tags: ['mascara', 'volume', 'eyes', 'waterproof'] },
      { name: '12-Shade Eyeshadow Palette', price: 1499, originalPrice: 1999, discount: 25, category: 'eyes', images: ['https://images.pexels.com/photos/2767038/pexels-photo-2767038.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.7, reviewCount: 2134, isBestseller: true, description: 'Versatile 12-shade palette with matte, shimmer and glitter finishes. Highly pigmented, blendable. Neutrals, pinks and smoky shades for day and night.', howToUse: 'Use flat brush for color, fluffy brush for blending. Apply light shades on lid, medium on crease, dark on outer corner.', tags: ['eyeshadow', 'palette', 'eyes', 'pigmented'] },
      { name: 'Precision Liquid Eyeliner', price: 349, originalPrice: 499, discount: 30, category: 'eyes', images: ['https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, reviewCount: 3876, description: 'Ultra-fine precision tip liquid eyeliner for perfect wings. Smudge-proof, waterproof formula. Intense black pigment that lasts all day.', howToUse: 'Start from inner corner. Draw thin line close to lash line, extend to create desired wing. Let dry completely.', tags: ['eyeliner', 'liquid', 'precision', 'eyes'] },
      // FACE
      { name: 'HD Matte Foundation SPF 15', price: 999, originalPrice: 1499, discount: 33, category: 'face', images: ['https://images.pexels.com/photos/6621461/pexels-photo-6621461.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, reviewCount: 4287, isBestseller: true, description: 'Full coverage HD foundation with matte finish and SPF 15. 15 shades for Indian skin tones. Oil-free, long-lasting formula. Blurs pores and imperfections.', howToUse: 'Shake well. Apply with brush, beauty blender or fingers. Build coverage where needed. Set with powder.', tags: ['foundation', 'matte', 'spf15', 'face', 'full coverage'] },
      { name: 'Dewy Skin Tinted Moisturizer SPF 20', price: 799, originalPrice: 1099, discount: 27, category: 'face', images: ['https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.3, reviewCount: 1654, isNew: true, description: 'Lightweight tinted moisturizer with SPF 20 for a natural dewy glow. Light-medium coverage with Hyaluronic Acid and Vitamin C. 8 shades available.', howToUse: 'Apply with fingers or brush to face and neck. Perfect for no-makeup makeup look.', tags: ['tinted moisturizer', 'dewy', 'spf20', 'face', 'natural'] },
      { name: 'Blush & Bronze Sculpt Duo', price: 899, originalPrice: 1299, discount: 30, category: 'face', images: ['https://images.pexels.com/photos/3373736/pexels-photo-3373736.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.6, reviewCount: 987, description: 'Two-in-one blush and bronzer palette for sculpted sun-kissed look. Silky-smooth powder that blends seamlessly. Buildable pigment. 4 duos available.', howToUse: 'Apply bronzer to hollows of cheeks, temples and jawline. Sweep blush on apples of cheeks upward toward temples.', tags: ['blush', 'bronzer', 'face', 'palette'] },
      { name: 'Glass Skin Illuminating Primer', price: 699, originalPrice: 999, discount: 30, category: 'face', images: ['https://images.pexels.com/photos/7256645/pexels-photo-7256645.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.5, reviewCount: 1432, isNew: true, description: 'Illuminating primer that creates a lit-from-within glass skin effect. Blurs pores and fine lines. Infused with Pearl Powder and Hyaluronic Acid.', howToUse: 'Apply thin layer to moisturized face. Wait 1 minute before applying foundation. Mix into foundation for all-over glow.', tags: ['primer', 'illuminating', 'glass skin', 'face'] },
      { name: 'Weightless Translucent Setting Powder', price: 599, originalPrice: 849, discount: 29, category: 'face', images: ['https://images.pexels.com/photos/3685538/pexels-photo-3685538.jpeg?auto=compress&cs=tinysrgb&w=600'], rating: 4.4, reviewCount: 2198, isBestseller: true, description: 'Ultra-fine setting powder that locks makeup for 12 hours. Controls oil without cakiness. Blurs imperfections for skin-like finish. Translucent and 4 tinted shades.', howToUse: 'Dust over foundation with large fluffy brush. Focus on T-zone for oil control. Can be used to bake under eyes.', tags: ['setting powder', 'translucent', 'matte', 'face'] }
    ];
    await Product.insertMany(products);
    res.json({ message: `${products.length} products seeded successfully! 🌸` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// ✅ /:id is LAST so it doesn't catch /seed
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
module.exports = router;