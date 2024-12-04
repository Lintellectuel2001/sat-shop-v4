const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Créer une catégorie
router.post('/', async (req, res) => {
  try {
    const { name, description, parentId, image } = req.body;
    const categoryData = {
      name,
      description,
      parentId: parentId || null,
      image,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('categories').add(categoryData);
    res.status(201).json({
      id: docRef.id,
      ...categoryData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir toutes les catégories
router.get('/', async (req, res) => {
  try {
    const snapshot = await admin.firestore().collection('categories').get();
    const categories = [];
    snapshot.forEach(doc => {
      categories.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Organiser les catégories en arborescence
    const categoryTree = categories.reduce((acc, category) => {
      if (!category.parentId) {
        category.children = categories.filter(c => c.parentId === category.id);
        acc.push(category);
      }
      return acc;
    }, []);

    res.json(categoryTree);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour une catégorie
router.put('/:categoryId', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    const updateData = {
      ...(name && { name, slug: name.toLowerCase().replace(/\s+/g, '-') }),
      ...(description && { description }),
      ...(image && { image }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await admin.firestore().collection('categories').doc(req.params.categoryId).update(updateData);
    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer une catégorie
router.delete('/:categoryId', async (req, res) => {
  try {
    // Vérifier s'il y a des produits dans cette catégorie
    const productsSnapshot = await admin.firestore()
      .collection('products')
      .where('categoryId', '==', req.params.categoryId)
      .get();

    if (!productsSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing products' 
      });
    }

    // Vérifier s'il y a des sous-catégories
    const subCategoriesSnapshot = await admin.firestore()
      .collection('categories')
      .where('parentId', '==', req.params.categoryId)
      .get();

    if (!subCategoriesSnapshot.empty) {
      return res.status(400).json({ 
        error: 'Cannot delete category with existing subcategories' 
      });
    }

    await admin.firestore().collection('categories').doc(req.params.categoryId).delete();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les produits d'une catégorie avec pagination
router.get('/:categoryId/products', async (req, res) => {
  try {
    const { page = 1, limit = 10, sort = 'createdAt', order = 'desc' } = req.query;
    const offset = (page - 1) * limit;

    let query = admin.firestore()
      .collection('products')
      .where('categoryId', '==', req.params.categoryId);

    // Ajout du tri
    query = query.orderBy(sort, order);

    // Pagination
    const snapshot = await query.limit(parseInt(limit)).offset(offset).get();
    
    const products = [];
    snapshot.forEach(doc => {
      products.push({
        id: doc.id,
        ...doc.data()
      });
    });

    // Obtenir le nombre total de produits
    const totalSnapshot = await admin.firestore()
      .collection('products')
      .where('categoryId', '==', req.params.categoryId)
      .count()
      .get();

    res.json({
      products,
      pagination: {
        total: totalSnapshot.data().count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalSnapshot.data().count / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
