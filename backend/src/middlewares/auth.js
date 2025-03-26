const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware pour vérifier le token JWT et authentifier l'utilisateur
 */
exports.authenticate = async (req, res, next) => {
  try {
    // Vérifier si le token est présent
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé. Token manquant' 
      });
    }
    
    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Vérifier si l'utilisateur existe toujours
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé ou token invalide' 
      });
    }
    
    // Ajouter l'utilisateur à l'objet req
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token invalide' 
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expiré' 
      });
    }
    
    console.error('Erreur d\'authentification:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Erreur d\'authentification' 
    });
  }
};

/**
 * Middleware pour vérifier si l'utilisateur est un administrateur
 */
exports.isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Accès interdit. Privilèges administrateur requis' 
    });
  }
  next();
};

/**
 * Middleware pour rendre l'authentification optionnelle
 * Utile pour les routes qui fonctionnent différemment selon que l'utilisateur est connecté ou non
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (user) {
      req.user = user;
    }
    
    next();
  } catch (error) {
    // En cas d'erreur, on continue simplement sans authentifier
    next();
  }
};