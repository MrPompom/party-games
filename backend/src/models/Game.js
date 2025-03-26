const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  longDescription: {
    type: String,
    default: ''
  },
  howToPlay: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    required: true,
    enum: ['rules', 'single-device', 'multiplayer']
  },
  minPlayers: {
    type: Number,
    required: true,
    min: 1
  },
  maxPlayers: {
    type: Number,
    required: true,
    min: 1
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
    comment: "Durée en minutes"
  },
  thumbnail: {
    type: String,
    default: ''
  },
  difficulty: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  categories: [{
    type: String
  }],
  rulesContent: {
    type: String,
    default: ''
  },
  gameData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  popularity: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index pour la recherche sur titre et description
gameSchema.index({ title: 'text', description: 'text' });

// Utiliser mongoose.model() avec un contrôle pour éviter l'erreur de redéfinition
let Game;
try {
  // Essayer d'obtenir le modèle existant
  Game = mongoose.model('Game');
} catch (e) {
  // Si le modèle n'existe pas encore, le créer
  Game = mongoose.model('Game', gameSchema);
}

module.exports = Game;