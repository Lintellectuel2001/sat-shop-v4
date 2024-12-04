const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Créer une commande
router.post('/', async (req, res) => {
  try {
    const { userId, items, shippingAddress, paymentMethod } = req.body;
    
    // Calculer le total
    let total = 0;
    for (const item of items) {
      const productDoc = await admin.firestore().collection('products').doc(item.productId).get();
      const product = productDoc.data();
      total += product.price * item.quantity;
    }

    const orderData = {
      userId,
      items,
      total,
      shippingAddress,
      paymentMethod,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const orderRef = await admin.firestore().collection('orders').add(orderData);
    
    // Vider le panier
    await admin.firestore().collection('carts').doc(userId).delete();

    res.status(201).json({ 
      message: 'Order created successfully', 
      orderId: orderRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir les commandes d'un utilisateur
router.get('/user/:userId', async (req, res) => {
  try {
    const ordersSnapshot = await admin.firestore()
      .collection('orders')
      .where('userId', '==', req.params.userId)
      .orderBy('createdAt', 'desc')
      .get();

    const orders = [];
    ordersSnapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtenir une commande spécifique
router.get('/:orderId', async (req, res) => {
  try {
    const orderDoc = await admin.firestore().collection('orders').doc(req.params.orderId).get();
    if (!orderDoc.exists) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({
      id: orderDoc.id,
      ...orderDoc.data()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le statut d'une commande
router.put('/:orderId/status', async (req, res) => {
  try {
    const { status } = req.body;
    await admin.firestore().collection('orders').doc(req.params.orderId).update({
      status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
