const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticate, optionalAuth } = require('../middlewares/auth');

// Routes publiques ou semi-protégées
router.get('/', roomController.getPublicRooms);
router.get('/:id', roomController.getRoomById);
router.post('/join', optionalAuth, roomController.joinRoom);

// Routes qui peuvent être utilisées avec ou sans compte
router.post('/', optionalAuth, roomController.createRoom);

// Routes protégées nécessitant une identification (via token ou ID de joueur)
router.delete('/:id/leave', optionalAuth, roomController.leaveRoom);
router.put('/:id/ready', optionalAuth, roomController.toggleReady);
router.put('/:id/start', optionalAuth, roomController.startGame);

module.exports = router;