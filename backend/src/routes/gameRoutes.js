const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const { authenticate, isAdmin, optionalAuth } = require('../middlewares/auth');

// Routes publiques
router.get('/', gameController.getAllGames);
router.get('/popular', gameController.getPopularGames);
router.get('/:id', gameController.getGameById);

// Routes protégées
router.post('/:id/favorite', authenticate, gameController.addToFavorites);
router.delete('/:id/favorite', authenticate, gameController.removeFromFavorites);

// Routes admin
router.post('/', authenticate, isAdmin, gameController.createGame);
router.put('/:id', authenticate, isAdmin, gameController.updateGame);
router.delete('/:id', authenticate, isAdmin, gameController.deleteGame);

module.exports = router;