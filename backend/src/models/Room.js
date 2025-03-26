const mongoose = require('mongoose');
const crypto = require('crypto');

const roomSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    default: () => crypto.randomBytes(3).toString('hex').toUpperCase()
  },
  game: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    username: {
      type: String,
      required: true
    },
    isConnected: {
      type: Boolean,
      default: true
    },
    isReady: {
      type: Boolean,
      default: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    socketId: {
      type: String,
      default: ''
    }
  }],
  status: {
    type: String,
    enum: ['waiting', 'playing', 'finished', 'closed'],
    default: 'waiting'
  },
  settings: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  gameState: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  maxPlayers: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) // Expire après 24h
  }
}, {
  timestamps: true
});

// Index pour la recherche par code
roomSchema.index({ code: 1 });

// Index pour les salles en attente
roomSchema.index({ status: 1, isPrivate: 1 });

// TTL index pour expiration
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Utiliser mongoose.model() avec un contrôle pour éviter l'erreur de redéfinition
let Room;
try {
  // Essayer d'obtenir le modèle existant
  Room = mongoose.model('Room');
} catch (e) {
  // Si le modèle n'existe pas encore, le créer
  Room = mongoose.model('Room', roomSchema);
}

module.exports = Room;