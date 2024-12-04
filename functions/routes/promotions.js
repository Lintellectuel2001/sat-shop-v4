const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Créer une promotion
router.post('/', async (req, res) => {
  try {
    const { code, discountType, discountValue, startDate, endDate, minPurchase, maxUses } = req.body;
    
    const promotionData = {
      code: code.toUpperCase(),
      discountType, // 'percentage' or 'fixed'
      discountValue,
      startDate: admin.firestore.Timestamp.fromDate(new Date(startDate)),
      endDate: admin.firestore.Timestamp.fromDate(new Date(endDate)),
      minPurchase,
      maxUses,
      currentUses: 0,
      active: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await admin.firestore().collection('promotions').add(promotionData);
    res.status(201).json({
      id: docRef.id,
      ...promotionData
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vérifier une promotion
router.post('/verify', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    
    const snapshot = await admin.firestore()
      .collection('promotions')
      .where('code', '==', code.toUpperCase())
      .where('active', '==', true)
      .get();

    if (snapshot.empty) {
      return res.status(404).json({ error: 'Invalid promotion code' });
    }

    const promotion = {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };

    const now = admin.firestore.Timestamp.now();

    // Vérifications
    if (now < promotion.startDate) {
      return res.status(400).json({ error: 'Promotion not started yet' });
    }
    if (now > promotion.endDate) {
      return res.status(400).json({ error: 'Promotion has expired' });
    }
    if (promotion.currentUses >= promotion.maxUses) {
      return res.status(400).json({ error: 'Promotion maximum uses reached' });
    }
    if (cartTotal < promotion.minPurchase) {
      return res.status(400).json({ 
        error: `Minimum purchase amount of ${promotion.minPurchase} required` 
      });
    }

    // Calculer la réduction
    let discount = 0;
    if (promotion.discountType === 'percentage') {
      discount = (cartTotal * promotion.discountValue) / 100;
    } else {
      discount = promotion.discountValue;
    }

    res.json({
      valid: true,
      discount,
      promotion
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Désactiver une promotion
router.put('/:promotionId/deactivate', async (req, res) => {
  try {
    await admin.firestore().collection('promotions').doc(req.params.promotionId).update({
      active: false,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: 'Promotion deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
