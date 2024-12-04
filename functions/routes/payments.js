const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Créer une intention de paiement
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'eur', orderId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe utilise les centimes
      currency,
      metadata: {
        orderId
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Webhook pour gérer les événements Stripe
router.post('/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gérer les différents types d'événements
  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentFailure(failedPayment);
        break;
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Gérer un paiement réussi
async function handlePaymentSuccess(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  
  // Mettre à jour le statut de la commande
  await admin.firestore().collection('orders').doc(orderId).update({
    status: 'paid',
    paymentId: paymentIntent.id,
    paidAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // Mettre à jour le stock des produits
  const orderDoc = await admin.firestore().collection('orders').doc(orderId).get();
  const order = orderDoc.data();

  const batch = admin.firestore().batch();
  
  for (const item of order.items) {
    const productRef = admin.firestore().collection('products').doc(item.productId);
    batch.update(productRef, {
      stock: admin.firestore.FieldValue.increment(-item.quantity)
    });
  }

  await batch.commit();
}

// Gérer un paiement échoué
async function handlePaymentFailure(paymentIntent) {
  const orderId = paymentIntent.metadata.orderId;
  
  await admin.firestore().collection('orders').doc(orderId).update({
    status: 'payment_failed',
    paymentError: paymentIntent.last_payment_error?.message,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
}

// Obtenir l'historique des paiements d'un utilisateur
router.get('/user/:userId/history', async (req, res) => {
  try {
    const snapshot = await admin.firestore()
      .collection('orders')
      .where('userId', '==', req.params.userId)
      .where('status', '==', 'paid')
      .orderBy('paidAt', 'desc')
      .get();

    const payments = [];
    snapshot.forEach(doc => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Rembourser un paiement
router.post('/:paymentId/refund', async (req, res) => {
  try {
    const { amount, reason } = req.body;

    const refund = await stripe.refunds.create({
      payment_intent: req.params.paymentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: reason || 'requested_by_customer'
    });

    // Mettre à jour le statut de la commande
    const orderSnapshot = await admin.firestore()
      .collection('orders')
      .where('paymentId', '==', req.params.paymentId)
      .get();

    if (!orderSnapshot.empty) {
      const orderDoc = orderSnapshot.docs[0];
      await orderDoc.ref.update({
        status: amount ? 'partially_refunded' : 'refunded',
        refundId: refund.id,
        refundedAmount: refund.amount / 100,
        refundedAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    res.json(refund);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
