const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

// Initialiser Firebase Admin
admin.initializeApp();

// Importer les routes
const authRoutes = require('./routes/auth');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');
const promotionRoutes = require('./routes/promotions');
const categoryRoutes = require('./routes/categories');
const paymentRoutes = require('./routes/payments');

const app = express();

// Middleware pour Stripe webhooks
app.use('/payments/webhook', express.raw({ type: 'application/json' }));

// Middleware général
app.use(cors({ origin: true }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);
app.use('/promotions', promotionRoutes);
app.use('/categories', categoryRoutes);
app.use('/payments', paymentRoutes);

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Export the Express app as a Firebase Cloud Function
exports.api = functions.https.onRequest(app);
