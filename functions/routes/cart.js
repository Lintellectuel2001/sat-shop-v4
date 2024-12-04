const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Ajouter au panier
router.post('/:userId/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cartRef = admin.firestore().collection('carts').doc(req.params.userId);
    
    // Vérifier le stock
    const productDoc = await admin.firestore().collection('products').doc(productId).get();
    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = productDoc.data();
    if (product.stock < quantity) {
      return res.status(400).json({ error: 'Not enough stock' });
    }

    await cartRef.set({
      items: admin.firestore.FieldValue.arrayUnion({
        productId,
        quantity,
        price: product.price,
        name: product.name
      }),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });

    res.json({ message: 'Item added to cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir le panier
router.get('/:userId', async (req, res) => {
  try {
    const cartDoc = await admin.firestore().collection('carts').doc(req.params.userId).get();
    if (!cartDoc.exists) {
      return res.json({ items: [] });
    }
    res.json(cartDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour la quantité
router.put('/:userId/items/:productId', async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartRef = admin.firestore().collection('carts').doc(req.params.userId);
    const cart = (await cartRef.get()).data();
    
    const updatedItems = cart.items.map(item => {
      if (item.productId === req.params.productId) {
        return { ...item, quantity };
      }
      return item;
    });

    await cartRef.update({
      items: updatedItems,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Cart updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Supprimer du panier
router.delete('/:userId/items/:productId', async (req, res) => {
  try {
    const cartRef = admin.firestore().collection('carts').doc(req.params.userId);
    const cart = (await cartRef.get()).data();
    
    const updatedItems = cart.items.filter(item => item.productId !== req.params.productId);

    await cartRef.update({
      items: updatedItems,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
