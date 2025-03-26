<template>
    <div class="game-catalog">
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Catalogue de jeux</h1>
          <p class="text-lg">Découvrez tous nos jeux et choisissez celui qui animera votre soirée</p>
        </div>
      </div>
  
      <!-- Filtres -->
      <div class="bg-white shadow-md py-4">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex-1 min-w-[200px]">
              <label for="type" class="block text-sm font-medium text-gray-700 mb-1">Type de jeu</label>
              <select 
                id="type" 
                v-model="filters.type"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @change="applyFilters"
              >
                <option value="">Tous les types</option>
                <option value="rules">Règles de jeu</option>
                <option value="single-device">Jeu sur un appareil</option>
                <option value="multiplayer">Jeu multijoueur</option>
              </select>
            </div>
  
            <div class="flex-1 min-w-[200px]">
              <label for="players" class="block text-sm font-medium text-gray-700 mb-1">Nombre de joueurs</label>
              <select 
                id="players" 
                v-model="filters.playerCount"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @change="applyFilters"
              >
                <option value="">Tous</option>
                <option value="2">2 joueurs</option>
                <option value="3-4">3-4 joueurs</option>
                <option value="5-8">5-8 joueurs</option>
                <option value="8+">8+ joueurs</option>
              </select>
            </div>
  
            <div class="flex-1 min-w-[200px]">
              <label for="duration" class="block text-sm font-medium text-gray-700 mb-1">Durée</label>
              <select 
                id="duration" 
                v-model="filters.duration"
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @change="applyFilters"
              >
                <option value="">Toutes durées</option>
                <option value="15">Moins de 15 min</option>
                <option value="30">Moins de 30 min</option>
                <option value="60">Moins de 1h</option>
                <option value="90">Moins de 1h30</option>
                <option value="120">Plus d'1h30</option>
              </select>
            </div>
  
            <div class="flex-1 min-w-[200px]">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Recherche</label>
              <input 
                type="text" 
                id="search" 
                v-model="searchQuery"
                placeholder="Rechercher un jeu..." 
                class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                @input="applyFilters"
              />
            </div>
          </div>
        </div>
      </div>
  
      <!-- Liste des jeux -->
      <div class="container mx-auto px-4 py-8">
        <!-- Chargement -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
  
        <!-- Pas de jeu -->
        <div v-else-if="games.length === 0" class="text-center py-12">
          <h3 class="text-xl font-medium text-gray-800 mb-4">Aucun jeu ne correspond à vos critères</h3>
          <p class="text-gray-600 mb-6">Essayez de modifier vos filtres ou effectuez une recherche différente</p>
          <button @click="resetFilters" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
            Réinitialiser les filtres
          </button>
        </div>
  
        <!-- Liste des jeux -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <GameCard 
            v-for="game in games" 
            :key="game.id" 
            :game="game" 
            @click="navigateToGame(game.id)"
          />
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  import GameCard from '@/components/games/GameCard.vue';
  
  export default {
    name: 'GameCatalogPage',
    components: {
      GameCard
    },
    setup() {
      const gameStore = useGameStore();
      const route = useRoute();
      const router = useRouter();
      
      const searchQuery = ref('');
      const filters = ref({
        type: '',
        playerCount: '',
        duration: ''
      });
      const loading = ref(false);
  
      // Charger les jeux
      onMounted(async () => {
        loading.value = true;
        
        // Initialiser les filtres depuis les query params
        if (route.query.type) {
          filters.value.type = route.query.type;
        }
        if (route.query.players) {
          filters.value.playerCount = route.query.players;
        }
        if (route.query.duration) {
          filters.value.duration = route.query.duration;
        }
        if (route.query.search) {
          searchQuery.value = route.query.search;
        }
        
        // Charger les jeux
        await gameStore.fetchAllGames();
        
        // Appliquer les filtres initiaux
        gameStore.setFilters({
          type: filters.value.type,
          playerCount: filters.value.playerCount ? parseInt(filters.value.playerCount) : null,
          duration: filters.value.duration ? parseInt(filters.value.duration) : null
        });
        
        loading.value = false;
      });
      
      // Liste des jeux filtrée
      const games = computed(() => {
        // Si une recherche est en cours, filtrer par la recherche
        if (searchQuery.value.trim()) {
          const query = searchQuery.value.toLowerCase();
          return gameStore.filteredGames.filter(game => 
            game.title.toLowerCase().includes(query) || 
            (game.description && game.description.toLowerCase().includes(query))
          );
        }
        
        return gameStore.filteredGames;
      });
      
      // Appliquer les filtres
      const applyFilters = () => {
        gameStore.setFilters({
          type: filters.value.type,
          playerCount: filters.value.playerCount ? parseInt(filters.value.playerCount) : null,
          duration: filters.value.duration ? parseInt(filters.value.duration) : null
        });
        
        // Mettre à jour l'URL avec les filtres
        router.replace({
          query: {
            ...route.query,
            type: filters.value.type || undefined,
            players: filters.value.playerCount || undefined,
            duration: filters.value.duration || undefined,
            search: searchQuery.value || undefined
          }
        });
      };
      
      // Réinitialiser les filtres
      const resetFilters = () => {
        filters.value = {
          type: '',
          playerCount: '',
          duration: ''
        };
        searchQuery.value = '';
        gameStore.resetFilters();
        
        router.replace({ query: {} });
      };
      
      // Naviguer vers la page du jeu
      const navigateToGame = (gameId) => {
        router.push({ name: 'GameDetail', params: { id: gameId } });
      };
      
      return {
        games,
        filters,
        searchQuery,
        loading,
        applyFilters,
        resetFilters,
        navigateToGame
      };
    }
  };
  </script>