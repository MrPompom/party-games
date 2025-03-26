import { defineStore } from 'pinia';
import gameService from '@/services/gameService';

export const useGameStore = defineStore('game', {
  state: () => ({
    games: [],
    popularGames: [],
    currentGame: null,
    loading: false,
    error: null,
    filters: {
      category: null,
      playerCount: null,
      duration: null,
      type: null, // 'rules', 'single-device', 'multiplayer'
    }
  }),
  
  getters: {
    getGameById: (state) => (id) => {
      return state.games.find(game => game.id === id);
    },
    
    filteredGames: (state) => {
      let result = [...state.games];
      
      if (state.filters.category) {
        result = result.filter(game => game.category === state.filters.category);
      }
      
      if (state.filters.playerCount) {
        result = result.filter(game => 
          game.minPlayers <= state.filters.playerCount && 
          game.maxPlayers >= state.filters.playerCount
        );
      }
      
      if (state.filters.duration) {
        result = result.filter(game => game.duration <= state.filters.duration);
      }
      
      if (state.filters.type) {
        result = result.filter(game => game.type === state.filters.type);
      }
      
      return result;
    }
  },
  
  actions: {
    async fetchAllGames() {
      this.loading = true;
      try {
        const response = await gameService.getAllGames();
        this.games = response.data;
        this.error = null;
      } catch (err) {
        this.error = err.message || 'Une erreur est survenue lors du chargement des jeux';
        console.error('Erreur lors du chargement des jeux:', err);
      } finally {
        this.loading = false;
      }
    },
    
    async fetchPopularGames() {
      this.loading = true;
      try {
        const response = await gameService.getPopularGames();
        this.popularGames = response.data;
        this.error = null;
      } catch (err) {
        // En cas d'erreur API, utiliser des données par défaut pour la démo
        console.warn('Utilisation de données de démonstration pour les jeux populaires');
        this.popularGames = [
          {
            id: '1',
            title: 'Loup-Garou',
            description: 'Démasquez les loups-garous avant qu\'ils ne dévorent tout le village',
            thumbnail: '/images/games/werewolf.jpg',
            type: 'multiplayer',
            minPlayers: 8,
            maxPlayers: 18,
            duration: 30,
            popularity: 4.8
          },
          {
            id: '2',
            title: 'Tu Te Mets Combien ?',
            description: 'Testez vos connaissances et celles de vos amis dans ce quiz endiablé',
            thumbnail: '/images/games/quiz.jpg',
            type: 'single-device',
            minPlayers: 2,
            maxPlayers: 8,
            duration: 45,
            popularity: 4.6
          },
          {
            id: '3',
            title: 'Poker',
            description: 'Règles complètes du Texas Hold\'em et autres variantes de poker',
            thumbnail: '/images/games/poker.jpg',
            type: 'rules',
            minPlayers: 2,
            maxPlayers: 10,
            duration: 60,
            popularity: 4.5
          },
          {
            id: '4',
            title: 'Blanc-Manger Coco',
            description: 'Un jeu d\'humour noir où vous complétez des phrases absurdes',
            thumbnail: '/images/games/cards.jpg',
            type: 'single-device',
            minPlayers: 3,
            maxPlayers: 12,
            duration: 30,
            popularity: 4.7
          }
        ];
      } finally {
        this.loading = false;
      }
    },
    
    async fetchGameById(id) {
      this.loading = true;
      try {
        const response = await gameService.getGameById(id);
        this.currentGame = response.data;
        this.error = null;
        return this.currentGame;
      } catch (err) {
        this.error = err.message || `Une erreur est survenue lors du chargement du jeu ${id}`;
        console.error(`Erreur lors du chargement du jeu ${id}:`, err);
        return null;
      } finally {
        this.loading = false;
      }
    },
    
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    
    resetFilters() {
      this.filters = {
        category: null,
        playerCount: null,
        duration: null,
        type: null
      };
    }
  }
});