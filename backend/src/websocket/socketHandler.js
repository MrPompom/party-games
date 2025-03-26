const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Room = require('../models/Room');

// Stockage des connexions actives
const connectedUsers = new Map();
const activeRooms = new Map();

/**
 * Configuration et gestion des événements Socket.IO
 * @param {Object} io - Instance Socket.IO
 */
function setupSocketHandlers(io) {
  // Middleware d'authentification
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      let user = null;
      
      // Si un token est fourni, authentifier l'utilisateur
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
        user = await User.findById(decoded.id).select('-password');
        if (user) {
          socket.user = user;
        }
      }
      
      // Autoriser la connexion même sans authentification
      next();
    } catch (error) {
      // En cas d'erreur de token, autoriser quand même mais sans user
      next();
    }
  });

  io.on('connection', (socket) => {
    console.log('Nouvelle connexion socket:', socket.id);
    
    // Enregistrer la connexion utilisateur si authentifié
    if (socket.user) {
      connectedUsers.set(socket.user._id.toString(), {
        socketId: socket.id,
        user: socket.user
      });
      console.log(`Utilisateur ${socket.user.username} connecté`);
    }

    // === GESTION DES SALLES ===

    // Rejoindre une salle
    socket.on('join-room', async ({ roomId, username }) => {
      try {
        const room = await Room.findById(roomId);
        
        if (!room) {
          return socket.emit('error', { message: 'Salle introuvable' });
        }
        
        // Ajouter le joueur à la salle si pas déjà présent
        let playerInfo = null;
        
        if (socket.user) {
          // Joueur authentifié
          playerInfo = room.players.find(p => 
            p.userId && p.userId.toString() === socket.user._id.toString()
          );
        } else if (username) {
          // Joueur anonyme avec username
          playerInfo = room.players.find(p => 
            !p.userId && p.username === username
          );
        }
        
        if (!playerInfo) {
          return socket.emit('error', { message: 'Vous n\'êtes pas dans cette salle' });
        }
        
        // Mettre à jour le socketId du joueur
        const playerIndex = room.players.findIndex(p => p._id.toString() === playerInfo._id.toString());
        room.players[playerIndex].socketId = socket.id;
        room.players[playerIndex].isConnected = true;
        await room.save();
        
        // Rejoindre le canal Socket.IO
        socket.join(`room:${roomId}`);
        
        // Ajouter à la liste des salles actives si pas déjà présente
        if (!activeRooms.has(roomId)) {
          activeRooms.set(roomId, {
            roomId,
            players: new Map()
          });
        }
        
        // Ajouter ce joueur à la liste des joueurs actifs dans la salle
        const activeRoom = activeRooms.get(roomId);
        activeRoom.players.set(playerInfo._id.toString(), {
          socketId: socket.id,
          userId: socket.user ? socket.user._id : null,
          username: socket.user ? socket.user.username : username
        });
        
        // Notifier tout le monde dans la salle qu'un joueur a rejoint
        io.to(`room:${roomId}`).emit('player-joined', {
          room: room,
          player: {
            id: playerInfo._id,
            username: playerInfo.username,
            isConnected: true
          }
        });
        
        // Envoyer les infos de la salle au joueur
        socket.emit('room-joined', { room });
        
        console.log(`Joueur ${playerInfo.username} a rejoint la salle ${roomId}`);
      } catch (error) {
        console.error('Erreur lors de la connexion à la salle:', error);
        socket.emit('error', { 
          message: 'Erreur lors de la connexion à la salle',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Quitter une salle
    socket.on('leave-room', async ({ roomId }) => {
      try {
        if (roomId) {
          socket.leave(`room:${roomId}`);
          
          // Retirer de la liste des joueurs actifs
          const activeRoom = activeRooms.get(roomId);
          if (activeRoom) {
            // Trouver le joueur par socketId
            for (const [playerId, player] of activeRoom.players.entries()) {
              if (player.socketId === socket.id) {
                activeRoom.players.delete(playerId);
                break;
              }
            }
            
            // Si plus aucun joueur, supprimer la salle active
            if (activeRoom.players.size === 0) {
              activeRooms.delete(roomId);
            }
          }
          
          console.log(`Socket ${socket.id} a quitté la salle ${roomId}`);
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion de la salle:', error);
      }
    });

    // Changer l'état "prêt"
    socket.on('toggle-ready', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId);
        
        if (!room) {
          return socket.emit('error', { message: 'Salle introuvable' });
        }
        
        // Trouver le joueur
        let playerIndex = -1;
        
        if (socket.user) {
          playerIndex = room.players.findIndex(p => 
            p.userId && p.userId.toString() === socket.user._id.toString()
          );
        } else {
          playerIndex = room.players.findIndex(p => p.socketId === socket.id);
        }
        
        if (playerIndex === -1) {
          return socket.emit('error', { message: 'Vous n\'êtes pas dans cette salle' });
        }
        
        // Inverser l'état "prêt"
        room.players[playerIndex].isReady = !room.players[playerIndex].isReady;
        await room.save();
        
        // Notifier tous les joueurs
        io.to(`room:${roomId}`).emit('player-ready-changed', {
          playerId: room.players[playerIndex]._id,
          isReady: room.players[playerIndex].isReady,
          room: room
        });
      } catch (error) {
        console.error('Erreur lors du changement d\'état prêt:', error);
        socket.emit('error', { 
          message: 'Erreur lors du changement d\'état',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Démarrer la partie
    socket.on('start-game', async ({ roomId }) => {
      try {
        const room = await Room.findById(roomId).populate('game');
        
        if (!room) {
          return socket.emit('error', { message: 'Salle introuvable' });
        }
        
        // Vérifier si c'est l'hôte
        if (socket.user && room.host && room.host.toString() !== socket.user._id.toString()) {
          return socket.emit('error', { message: 'Seul l\'hôte peut démarrer la partie' });
        }
        
        // Vérifier si tous les joueurs sont prêts
        const allReady = room.players.every(player => player.isReady);
        
        if (!allReady) {
          return socket.emit('error', { message: 'Tous les joueurs doivent être prêts pour démarrer' });
        }
        
        // Vérifier le nombre minimum de joueurs
        if (room.players.length < room.game.minPlayers) {
          return socket.emit('error', { message: `Il faut au moins ${room.game.minPlayers} joueurs pour démarrer` });
        }
        
        // Démarrer la partie
        room.status = 'playing';
        room.gameState = {
          startTime: new Date(),
          currentRound: 1,
          players: room.players.map(player => ({
            id: player._id,
            username: player.username,
            // Autres données spécifiques au jeu
          }))
          // Autres données spécifiques au jeu
        };
        
        await room.save();
        
        // Notifier tous les joueurs
        io.to(`room:${roomId}`).emit('game-started', { room });
      } catch (error) {
        console.error('Erreur lors du démarrage de la partie:', error);
        socket.emit('error', { 
          message: 'Erreur lors du démarrage de la partie',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Action de jeu (spécifique à chaque jeu)
    socket.on('game-action', async ({ roomId, action, data }) => {
      try {
        const room = await Room.findById(roomId);
        
        if (!room || room.status !== 'playing') {
          return socket.emit('error', { message: 'Partie non disponible' });
        }
        
        // Identifier le joueur
        let playerInfo = null;
        
        if (socket.user) {
          playerInfo = room.players.find(p => 
            p.userId && p.userId.toString() === socket.user._id.toString()
          );
        } else {
          playerInfo = room.players.find(p => p.socketId === socket.id);
        }
        
        if (!playerInfo) {
          return socket.emit('error', { message: 'Vous n\'êtes pas dans cette partie' });
        }
        
        // Traiter l'action en fonction du type de jeu
        // Cette partie devrait être adaptée pour chaque jeu spécifique
        let result = {};
        
        switch (action) {
          case 'play-card':
            // Logique spécifique au jeu
            result = { success: true, message: 'Carte jouée' };
            break;
            
          case 'vote':
            // Logique spécifique au jeu
            result = { success: true, message: 'Vote enregistré' };
            break;
            
          // Autres actions possibles
            
          default:
            return socket.emit('error', { message: 'Action non reconnue' });
        }
        
        // Mettre à jour l'état du jeu
        // Cette partie devrait être adaptée pour chaque jeu
        
        // Notifier tous les joueurs de l'action
        io.to(`room:${roomId}`).emit('game-updated', {
          action,
          player: {
            id: playerInfo._id,
            username: playerInfo.username
          },
          result,
          room
        });
      } catch (error) {
        console.error('Erreur lors de l\'action de jeu:', error);
        socket.emit('error', { 
          message: 'Erreur lors de l\'action de jeu',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
      }
    });

    // Message de chat
    socket.on('chat-message', ({ roomId, message }) => {
      if (!roomId || !message) return;
      
      // Identifier l'émetteur
      const sender = socket.user ? {
        id: socket.user._id,
        username: socket.user.username,
        isAuthenticated: true
      } : {
        id: socket.id,
        username: 'Anonyme',
        isAuthenticated: false
      };
      
      // Transmettre le message à tous les membres de la salle
      io.to(`room:${roomId}`).emit('chat-message', {
        sender,
        message,
        timestamp: new Date()
      });
    });

    // === ÉVÉNEMENTS DE DÉCONNEXION ===

    socket.on('disconnect', async () => {
      console.log('Socket déconnecté:', socket.id);
      
      // Retirer l'utilisateur des connectés
      if (socket.user) {
        connectedUsers.delete(socket.user._id.toString());
      }
      
      try {
        // Mettre à jour les salles où ce joueur était présent
        for (const [roomId, activeRoom] of activeRooms.entries()) {
          let playerToRemove = null;
          
          // Trouver le joueur par socketId
          for (const [playerId, player] of activeRoom.players.entries()) {
            if (player.socketId === socket.id) {
              playerToRemove = { id: playerId, ...player };
              break;
            }
          }
          
          if (playerToRemove) {
            // Mettre à jour l'état de connexion dans la base de données
            const room = await Room.findById(roomId);
            
            if (room) {
              const playerIndex = room.players.findIndex(p => 
                p._id.toString() === playerToRemove.id
              );
              
              if (playerIndex !== -1) {
                room.players[playerIndex].isConnected = false;
                await room.save();
                
                // Notifier les autres joueurs
                io.to(`room:${roomId}`).emit('player-disconnected', {
                  playerId: playerToRemove.id,
                  username: room.players[playerIndex].username
                });
              }
            }
            
            // Retirer le joueur des actifs
            activeRoom.players.delete(playerToRemove.id);
            
            // Si plus aucun joueur actif, supprimer la salle active
            if (activeRoom.players.size === 0) {
              activeRooms.delete(roomId);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    });
  });
}

module.exports = setupSocketHandlers;