import api from './api';

/**
 * Service pour gérer les interactions avec l'API des jeux
 */
const gameService = {
  /**
   * Récupère tous les jeux
   * @returns {Promise} Promesse avec les données des jeux
   */
  getAllGames() {
    return api.get('/games');
  },

  /**
   * Récupère un jeu par son ID
   * @param {string} id ID du jeu
   * @returns {Promise} Promesse avec les données du jeu
   */
  getGameById(id) {
    return api.get(`/games/${id}`);
  },

  /**
   * Récupère les jeux populaires
   * @param {number} limit Limite de résultats (optionnel)
   * @returns {Promise} Promesse avec les données des jeux populaires
   */
  getPopularGames(limit = 4) {
    return api.get('/games/popular', { params: { limit } });
  },

  /**
   * Récupère les jeux par catégorie
   * @param {string} category Catégorie des jeux
   * @returns {Promise} Promesse avec les données des jeux
   */
  getGamesByCategory(category) {
    return api.get('/games', { params: { category } });
  },

  /**
   * Récupère les jeux par type
   * @param {string} type Type de jeu ('rules', 'single-device', 'multiplayer')
   * @returns {Promise} Promesse avec les données des jeux
   */
  getGamesByType(type) {
    return api.get('/games', { params: { type } });
  },

  /**
   * Récupère les jeux filtrés selon plusieurs critères
   * @param {Object} filters Critères de filtrage
   * @returns {Promise} Promesse avec les données des jeux filtrés
   */
  getFilteredGames(filters) {
    return api.get('/games', { params: filters });
  },

  /**
   * Crée une nouvelle salle de jeu multijoueur
   * @param {string} gameId ID du jeu
   * @param {Object} settings Paramètres de la salle
   * @returns {Promise} Promesse avec les données de la salle créée
   */
  createGameRoom(gameId, settings) {
    return api.post(`/games/${gameId}/rooms`, settings);
  },

  /**
   * Rejoint une salle de jeu existante
   * @param {string} roomCode Code de la salle
   * @returns {Promise} Promesse avec les données de la salle
   */
  joinGameRoom(roomCode) {
    return api.post('/rooms/join', { roomCode });
  }
};

export default gameService;