const Game = require('../models/Game');

/**
 * @desc    Récupérer tous les jeux
 * @route   GET /api/games
 * @access  Public
 */
exports.getAllGames = async (req, res) => {
  try {
    const { category, type, search, minPlayers, maxPlayers, duration, limit, page = 1 } = req.query;
    
    // Construire la requête
    const query = {};
    
    // Filtrer par type de jeu
    if (type) {
      query.type = type;
    }
    
    // Filtrer par catégorie
    if (category) {
      query.categories = category;
    }
    
    // Filtrer par nombre de joueurs
    if (minPlayers) {
      query.maxPlayers = { $gte: parseInt(minPlayers) };
    }
    
    if (maxPlayers) {
      query.minPlayers = { $lte: parseInt(maxPlayers) };
    }
    
    // Filtrer par durée
    if (duration) {
      query.duration = { $lte: parseInt(duration) };
    }
    
    // Recherche textuelle
    if (search) {
      query.$text = { $search: search };
    }
    
    // Jeux actifs uniquement
    query.isActive = true;
    
    // Pagination
    const pageSize = parseInt(limit) || 12;
    const skip = (parseInt(page) - 1) * pageSize;
    
    // Exécuter la requête avec pagination
    const games = await Game.find(query)
      .sort({ popularity: -1 })
      .skip(skip)
      .limit(pageSize);
    
    // Compter le nombre total de jeux pour la pagination
    const total = await Game.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: games.length,
      total,
      pages: Math.ceil(total / pageSize),
      page: parseInt(page),
      data: games
    });
  } catch (error) {
    console.error('Erreur de récupération des jeux:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des jeux',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Récupérer un jeu par ID
 * @route   GET /api/games/:id
 * @access  Public
 */
exports.getGameById = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Erreur de récupération du jeu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du jeu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Récupérer les jeux populaires
 * @route   GET /api/games/popular
 * @access  Public
 */
exports.getPopularGames = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 4;
    
    const games = await Game.find({ isActive: true })
      .sort({ popularity: -1 })
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: games.length,
      data: games
    });
  } catch (error) {
    console.error('Erreur de récupération des jeux populaires:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des jeux populaires',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Créer un nouveau jeu (admin)
 * @route   POST /api/games
 * @access  Private/Admin
 */
exports.createGame = async (req, res) => {
  try {
    // Ajouter l'identifiant de l'admin créateur
    req.body.createdBy = req.user._id;
    
    const game = await Game.create(req.body);
    
    res.status(201).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Erreur de création du jeu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du jeu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Mettre à jour un jeu (admin)
 * @route   PUT /api/games/:id
 * @access  Private/Admin
 */
exports.updateGame = async (req, res) => {
  try {
    let game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }
    
    game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: game
    });
  } catch (error) {
    console.error('Erreur de mise à jour du jeu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du jeu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Supprimer un jeu (admin)
 * @route   DELETE /api/games/:id
 * @access  Private/Admin
 */
exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }
    
    await game.remove();
    
    res.status(200).json({
      success: true,
      message: 'Jeu supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur de suppression du jeu:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du jeu',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Ajouter un jeu aux favoris
 * @route   POST /api/games/:id/favorite
 * @access  Private
 */
exports.addToFavorites = async (req, res) => {
  try {
    const gameId = req.params.id;
    const userId = req.user._id;
    
    // Vérifier si le jeu existe
    const game = await Game.findById(gameId);
    
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Jeu non trouvé'
      });
    }
    
    // Ajouter aux favoris si pas déjà présent
    const user = await User.findById(userId);
    
    if (!user.favorites.includes(gameId)) {
      user.favorites.push(gameId);
      await user.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Jeu ajouté aux favoris'
    });
  } catch (error) {
    console.error('Erreur d\'ajout aux favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'ajout aux favoris',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * @desc    Retirer un jeu des favoris
 * @route   DELETE /api/games/:id/favorite
 * @access  Private
 */
exports.removeFromFavorites = async (req, res) => {
  try {
    const gameId = req.params.id;
    const userId = req.user._id;
    
    // Retirer des favoris
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== gameId);
    await user.save();
    
    res.status(200).json({
      success: true,
      message: 'Jeu retiré des favoris'
    });
  } catch (error) {
    console.error('Erreur de retrait des favoris:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors du retrait des favoris',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};