const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    const user = await admin.auth().createUser({
      email,
      password,
      displayName
    });
    
    await admin.firestore().collection('users').doc(user.uid).set({
      email,
      displayName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      role: 'customer'
    });

    res.status(201).json({ message: 'User created successfully', uid: user.uid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Récupérer le profil utilisateur
router.get('/profile/:uid', async (req, res) => {
  try {
    const userDoc = await admin.firestore().collection('users').doc(req.params.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userDoc.data());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mettre à jour le profil
router.put('/profile/:uid', async (req, res) => {
  try {
    const { displayName, phoneNumber, address } = req.body;
    await admin.firestore().collection('users').doc(req.params.uid).update({
      displayName,
      phoneNumber,
      address,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
