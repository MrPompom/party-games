const Room = require('../models/Room');
const Game = require('../models/Game');

/**
 * @desc    Créer une nouvelle salle de jeu
 * @route   POST /api/rooms
 * @access  Private
 */
exports.createRoom = async (req, res) => {
  try {
    const { gameId, isPrivate, maxPlayers, settings } = req.body;
    
    // Vérifier si le jeu existe
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }
    
    // Vérifier si le nombre de joueurs est valide
    if (maxPlayers < game.minPlayers || maxPlayers > game.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: `Le nombre de joueurs doit être entre ${game.minPlayers} et ${game.maxPlayers}`
      });
    }
    
    // Créer la salle
    const room = await Room.create({
      game: gameId,
      host: req.user ? req.user._id : null,
      isPrivate: !!isPrivate,
      maxPlayers: maxPlayers || game.maxPlayers,
      settings: settings || {},
      players: [{
        userId: req.user ? req.user._id : null,
        username: req.user ? req.user.username : req.body.username || 'Anonyme',
        isReady: true // Le créateur est prêt par défaut
      }]
    });
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Erreur de création de salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création de la salle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Rejoindre une salle de jeu par code
 * @route   POST /api/rooms/join
 * @access  Public
 */
exports.joinRoom = async (req, res) => {
  try {
    const { roomCode, username } = req.body;
    
    // Vérifier si la salle existe
    const room = await Room.findOne({ code: roomCode })
      .populate('game', 'title minPlayers maxPlayers');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable'
      });
    }
    
    // Vérifier si la salle est en attente
    if (room.status !== 'waiting') {
      return res.status(400).json({
        success: false,
        message: 'Impossible de rejoindre cette salle, la partie a déjà commencé'
      });
    }
    
    // Vérifier si la salle est pleine
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'Cette salle est pleine'
      });
    }
    
    // Vérifier si le joueur est déjà dans la salle
    const playerExists = room.players.some(player => 
      (req.user && player.userId && player.userId.toString() === req.user._id.toString()) ||
      (!req.user && !player.userId && player.username === username)
    );
    
    if (playerExists) {
      return res.status(400).json({
        success: false,
        message: 'Vous êtes déjà dans cette salle'
      });
    }
    
    // Ajouter le joueur à la salle
    room.players.push({
      userId: req.user ? req.user._id : null,
      username: req.user ? req.user.username : username || 'Anonyme'
    });
    
    await room.save();
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Erreur pour rejoindre la salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la tentative de rejoindre la salle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Récupérer les salles publiques disponibles
 * @route   GET /api/rooms
 * @access  Public
 */
exports.getPublicRooms = async (req, res) => {
  try {
    const { gameId, limit = 10, page = 1 } = req.query;
    
    // Construire la requête
    const query = { status: 'waiting', isPrivate: false };
    
    // Filtrer par jeu si spécifié
    if (gameId) {
      query.game = gameId;
    }
    
    // Pagination
    const pageSize = parseInt(limit);
    const skip = (parseInt(page) - 1) * pageSize;
    
    // Récupérer les salles
    const rooms = await Room.find(query)
      .populate('game', 'title thumbnail')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    
    // Compter le nombre total
    const total = await Room.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      pages: Math.ceil(total / pageSize),
      page: parseInt(page),
      data: rooms
    });
  } catch (error) {
    console.error('Erreur de récupération des salles:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des salles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Récupérer les détails d'une salle
 * @route   GET /api/rooms/:id
 * @access  Public
 */
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('game')
      .populate('host', 'username');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Erreur de récupération de la salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération de la salle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Quitter une salle
 * @route   DELETE /api/rooms/:id/leave
 * @access  Private
 */
exports.leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable'
      });
    }
    
    // Identifier l'index du joueur
    const playerIndex = room.players.findIndex(player => 
      (req.user && player.userId && player.userId.toString() === req.user._id.toString()) ||
      (!req.user && req.body.playerId && player._id.toString() === req.body.playerId)
    );
    
    if (playerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Vous n\'êtes pas dans cette salle'
      });
    }
    
    // Si c'est l'hôte qui quitte et qu'il y a d'autres joueurs
    if (room.host && req.user && room.host.toString() === req.user._id.toString() && room.players.length > 1) {
      // Attribuer l'hôte au joueur suivant
      const nextPlayerWithAccount = room.players.find(player => 
        player.userId && player.userId.toString() !== req.user._id.toString()
      );
      
      if (nextPlayerWithAccount) {
        room.host = nextPlayerWithAccount.userId;
      } else {
        // Si aucun joueur n'a de compte, supprimer la salle
        await room.remove();
        return res.status(200).json({
          success: true,
          message: 'Vous avez quitté la salle et celle-ci a été fermée'
        });
      }
    }
    
    // Si c'est le dernier joueur, fermer la salle
    if (room.players.length === 1) {
      await room.remove();
      return res.status(200).json({
        success: true,
        message: 'Vous avez quitté la salle et celle-ci a été fermée'
      });
    }
    
    // Sinon, retirer le joueur
    room.players.splice(playerIndex, 1);
    await room.save();
    
    res.status(200).json({
      success: true,
      message: 'Vous avez quitté la salle'
    });
  } catch (error) {
    console.error('Erreur pour quitter la salle:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la tentative de quitter la salle',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Changer l'état "prêt" d'un joueur
 * @route   PUT /api/rooms/:id/ready
 * @access  Private
 */
exports.toggleReady = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable'
      });
    }
    
    // Identifier le joueur
    const playerIndex = room.players.findIndex(player => 
      (req.user && player.userId && player.userId.toString() === req.user._id.toString()) ||
      (!req.user && req.body.playerId && player._id.toString() === req.body.playerId)
    );
    
    if (playerIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'Vous n\'êtes pas dans cette salle'
      });
    }
    
    // Inverser l'état "prêt"
    room.players[playerIndex].isReady = !room.players[playerIndex].isReady;
    await room.save();
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Erreur de changement d\'état prêt:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du changement d\'état',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Démarrer la partie (seulement l'hôte)
 * @route   PUT /api/rooms/:id/start
 * @access  Private
 */
exports.startGame = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate('game');
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable'
      });
    }
    
    // Vérifier si c'est l'hôte
    if (room.host && req.user && room.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Seul l\'hôte peut démarrer la partie'
      });
    }
    
    // Vérifier si tous les joueurs sont prêts
    const allReady = room.players.every(player => player.isReady);
    
    if (!allReady) {
      return res.status(400).json({
        success: false,
        message: 'Tous les joueurs doivent être prêts pour démarrer'
      });
    }
    
    // Vérifier si le nombre minimum de joueurs est atteint
    if (room.players.length < room.game.minPlayers) {
      return res.status(400).json({
        success: false,
        message: `Il faut au moins ${room.game.minPlayers} joueurs pour démarrer`
      });
    }
    
    // Démarrer la partie
    room.status = 'playing';
    room.gameState = {
      startTime: new Date(),
      currentRound: 1,
      // Autres données spécifiques au jeu
    };
    
    await room.save();
    
    // Notifier tous les joueurs via websocket
    // Cette partie sera gérée par le service WebSocket
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    console.error('Erreur de démarrage de partie:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du démarrage de la partie',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};