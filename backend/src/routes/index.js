const express = require('express');
const router = express.Router();

// Importer toutes les routes
const authRoutes = require('./authRoutes');
const gameRoutes = require('./gameRoutes');
const roomRoutes = require('./roomRoutes');

// Routes de test/santé
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API is running' });
});

// Configurer les routes
router.use('/auth', authRoutes);
router.use('/games', gameRoutes);
router.use('/rooms', roomRoutes);

// Gestion des routes inexistantes
router.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

module.exports = router;