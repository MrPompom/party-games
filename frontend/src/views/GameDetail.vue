<template>
    <div class="game-detail">
      <!-- Chargement -->
      <div v-if="loading" class="flex justify-center items-center py-24">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
      </div>
  
      <!-- Erreur -->
      <div v-else-if="error" class="container mx-auto px-4 py-24 text-center">
        <h2 class="text-2xl font-bold text-red-600 mb-4">
          Oups ! Une erreur est survenue.
        </h2>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <router-link to="/games" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Retour au catalogue
        </router-link>
      </div>
  
      <!-- Détails du jeu -->
      <div v-else-if="game" class="pb-12">
        <!-- En-tête -->
        <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-10">
          <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row gap-8">
              <div class="w-full md:w-1/3 lg:w-1/4">
                <img 
                  :src="game.thumbnail || '/images/placeholder-game.jpg'" 
                  :alt="game.title"
                  class="w-full h-auto object-cover rounded-lg shadow-lg"
                />
              </div>
              <div class="w-full md:w-2/3 lg:w-3/4">
                <h1 class="text-4xl font-bold mb-4">{{ game.title }}</h1>
                
                <div class="flex flex-wrap items-center gap-4 mb-6">
                  <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {{ typeLabels[game.type] || game.type }}
                  </span>
                  <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {{ game.minPlayers }}-{{ game.maxPlayers }} joueurs
                  </span>
                  <span class="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm">
                    {{ game.duration }} min
                  </span>
                  <div class="flex items-center">
                    <i class="fas fa-star text-yellow-400 mr-1"></i>
                    <span>{{ game.popularity }}</span>
                  </div>
                </div>
                
                <p class="text-lg mb-8">{{ game.description }}</p>
                
                <div class="flex flex-wrap gap-4">
                  <button 
                    v-if="game.type === 'rules'" 
                    @click="navigateToRules"
                    class="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition flex items-center"
                  >
                    <i class="fas fa-book mr-2"></i>
                    Voir les règles
                  </button>
                  
                  <button 
                    v-if="game.type === 'single-device'" 
                    @click="navigateToSingleDeviceGame"
                    class="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition flex items-center"
                  >
                    <i class="fas fa-play mr-2"></i>
                    Jouer maintenant
                  </button>
                  
                  <button 
                    v-if="game.type === 'multiplayer'" 
                    @click="navigateToMultiplayerLobby"
                    class="px-6 py-3 bg-white text-indigo-600 font-bold rounded-lg hover:bg-gray-100 transition flex items-center"
                  >
                    <i class="fas fa-users mr-2"></i>
                    Créer une partie
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Contenu détaillé -->
        <div class="container mx-auto px-4 py-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Colonne principale -->
            <div class="lg:col-span-2">
              <h2 class="text-2xl font-bold mb-6">À propos de ce jeu</h2>
              
              <div v-if="game.longDescription" class="prose max-w-none mb-8">
                <p>{{ game.longDescription }}</p>
              </div>
              
              <div v-if="game.howToPlay">
                <h3 class="text-xl font-bold mb-4">Comment jouer</h3>
                <div class="prose max-w-none mb-8">
                  <p>{{ game.howToPlay }}</p>
                </div>
              </div>
            </div>
            
            <!-- Colonne latérale -->
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 class="text-xl font-bold mb-4">Informations</h3>
                
                <div class="space-y-4">
                  <div>
                    <p class="text-gray-600">Type de jeu</p>
                    <p class="font-medium">{{ typeLabels[game.type] || game.type }}</p>
                  </div>
                  
                  <div>
                    <p class="text-gray-600">Nombre de joueurs</p>
                    <p class="font-medium">{{ game.minPlayers }} - {{ game.maxPlayers }}</p>
                  </div>
                  
                  <div>
                    <p class="text-gray-600">Durée moyenne</p>
                    <p class="font-medium">{{ game.duration }} minutes</p>
                  </div>
                  
                  <div v-if="game.difficultyLevel">
                    <p class="text-gray-600">Niveau de difficulté</p>
                    <p class="font-medium">{{ game.difficultyLevel }}/5</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-xl font-bold mb-4">Jeux similaires</h3>
                
                <div v-if="similarGames.length === 0" class="text-gray-600">
                  Aucun jeu similaire trouvé
                </div>
                
                <div v-else class="space-y-4">
                  <div 
                    v-for="similarGame in similarGames" 
                    :key="similarGame.id"
                    class="flex items-center gap-4 cursor-pointer hover:bg-gray-100 p-2 rounded-md transition"
                    @click="navigateToGame(similarGame.id)"
                  >
                    <img 
                      :src="similarGame.thumbnail || '/images/placeholder-game.jpg'" 
                      :alt="similarGame.title"
                      class="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p class="font-medium">{{ similarGame.title }}</p>
                      <p class="text-sm text-gray-600">{{ typeLabels[similarGame.type] || similarGame.type }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  
  export default {
    name: 'GameDetailPage',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const gameStore = useGameStore();
      const router = useRouter();
      const route = useRoute();
      
      const loading = ref(true);
      const error = ref(null);
      const similarGames = ref([]);
      
      const typeLabels = {
        'rules': 'Règles de jeu',
        'single-device': 'Jeu sur un appareil',
        'multiplayer': 'Jeu multijoueur'
      };
      
      // Récupérer les détails du jeu
      onMounted(async () => {
        try {
          loading.value = true;
          await gameStore.fetchGameById(props.id);
          
          // Simuler des jeux similaires (à remplacer par un appel API)
          // Dans un vrai projet, cela pourrait venir du backend
          similarGames.value = gameStore.games
            .filter(g => g.id !== props.id && g.type === gameStore.currentGame.type)
            .slice(0, 3);
            
          error.value = null;
        } catch (err) {
          error.value = "Impossible de charger les détails du jeu. Veuillez réessayer.";
          console.error(err);
        } finally {
          loading.value = false;
        }
      });
      
      const game = computed(() => gameStore.currentGame);
      
      // Navigation vers les différentes sections du jeu
      const navigateToRules = () => {
        router.push({ name: 'RulesGame', params: { id: props.id } });
      };
      
      const navigateToSingleDeviceGame = () => {
        router.push({ name: 'SingleDeviceGame', params: { id: props.id } });
      };
      
      const navigateToMultiplayerLobby = () => {
        router.push({ 
          name: 'MultiplayerLobby', 
          query: { gameId: props.id }
        });
      };
      
      const navigateToGame = (gameId) => {
        router.push({ name: 'GameDetail', params: { id: gameId } });
      };
      
      return {
        game,
        loading,
        error,
        similarGames,
        typeLabels,
        navigateToRules,
        navigateToSingleDeviceGame,
        navigateToMultiplayerLobby,
        navigateToGame
      };
    }
  };
  </script>