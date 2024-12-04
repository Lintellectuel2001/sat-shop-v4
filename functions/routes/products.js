const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Ajouter un produit
router.post('/', async (req, res) => {
  try {
    const { name, description, price, stock, categoryId, images } = req.body;
    const productData = {
      name,
      description,
      price,
      stock,
      categoryId,
      images,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('products').add(productData);
    res.status(201).json({
      id: docRef.id,
      ...productData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rechercher des produits
router.get('/search', async (req, res) => {
  try {
    const { query, category, minPrice, maxPrice } = req.query;
    let productsRef = admin.firestore().collection('products');

    if (category) {
      productsRef = productsRef.where('categoryId', '==', category);
    }

    const snapshot = await productsRef.get();
    let products = [];

    snapshot.forEach(doc => {
      const product = {
        id: doc.id,
        ...doc.data()
      };

      // Filtrage par prix
      if (minPrice && product.price < parseFloat(minPrice)) return;
      if (maxPrice && product.price > parseFloat(maxPrice)) return;

      // Recherche textuelle
      if (query) {
        const searchQuery = query.toLowerCase();
        if (!product.name.toLowerCase().includes(searchQuery) &&
            !product.description.toLowerCase().includes(searchQuery)) {
          return;
        }
      }

      products.push(product);
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les produits par catégorie
router.get('/category/:categoryId', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('products')
      .where('categoryId', '==', req.params.categoryId)
      .get();

    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ajouter un avis
router.post('/:productId/reviews', async (req, res) => {
  try {
    const { userId, rating, comment } = req.body;
    const review = {
      userId,
      rating,
      comment,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore()
      .collection('products')
      .doc(req.params.productId)
      .collection('reviews')
      .add(review);

    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les avis d'un produit
router.get('/:productId/reviews', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('products')
      .doc(req.params.productId)
      .collection('reviews')
      .orderBy('createdAt', 'desc')
      .get();

    const reviews = [];
    snapshot.forEach(doc => {
      reviews.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
