<template>
    <div class="single-device-game">
      <!-- Chargement -->
      <div v-if="loading" class="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
        <p class="mt-4 text-lg text-gray-600">Chargement du jeu...</p>
      </div>
  
      <!-- Erreur -->
      <div v-else-if="error" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div class="text-red-500 text-6xl mb-4">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Oups ! Une erreur est survenue</h1>
        <p class="text-gray-600 mb-6 text-center">{{ error }}</p>
        <router-link to="/games" class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
          Retour au catalogue
        </router-link>
      </div>
  
      <!-- Jeu non pris en charge -->
      <div v-else-if="!isSupportedGame" class="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
        <div class="text-amber-500 text-6xl mb-4">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 mb-2">Jeu non disponible</h1>
        <p class="text-gray-600 mb-6 text-center">
          Ce jeu n'est pas encore disponible en version numérique ou n'est pas de type "single-device".
        </p>
        <div class="flex flex-col sm:flex-row gap-4">
          <router-link 
            :to="{ name: 'GameDetail', params: { id } }" 
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition text-center"
          >
            Retour aux détails
          </router-link>
          <router-link 
            to="/games" 
            class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition text-center"
          >
            Parcourir d'autres jeux
          </router-link>
        </div>
      </div>
  
      <!-- Jeu -->
      <div v-else>
        <!-- En-tête du jeu -->
        <div 
          class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-4 flex justify-between items-center sticky top-0 z-10"
        >
          <div class="flex items-center">
            <router-link 
              :to="{ name: 'GameDetail', params: { id } }" 
              class="mr-4 text-white hover:text-gray-200"
              title="Retour aux détails du jeu"
            >
              <i class="fas fa-arrow-left"></i>
            </router-link>
            <h1 class="text-xl font-bold">{{ game.title }}</h1>
          </div>
          <button 
            @click="showRules = !showRules" 
            class="bg-white bg-opacity-20 px-3 py-1 rounded text-sm hover:bg-opacity-30 transition"
          >
            <i class="fas fa-book mr-1"></i> Règles
          </button>
        </div>
  
        <!-- Modal des règles -->
        <div v-if="showRules" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20 p-4">
          <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
              <h2 class="text-xl font-bold">Règles du jeu: {{ game.title }}</h2>
              <button @click="showRules = false" class="text-gray-500 hover:text-gray-700">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="p-6">
              <h3 class="font-bold text-lg mb-4">Comment jouer:</h3>
              <div class="whitespace-pre-line text-gray-700">{{ game.howToPlay }}</div>
              
              <div v-if="game.rulesContent" class="mt-6">
                <h3 class="font-bold text-lg mb-4">Règles détaillées:</h3>
                <div class="prose max-w-none">
                  <!-- Afficher les règles avec formatage basique -->
                  <div class="whitespace-pre-line" v-html="simpleFormatRules"></div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200 sticky bottom-0 bg-white">
              <button 
                @click="showRules = false" 
                class="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                Fermer les règles
              </button>
            </div>
          </div>
        </div>
  
        <!-- Contenu du jeu dynamique -->
        <component 
          :is="currentGameComponent" 
          :game="game" 
          :gameData="game.gameData || {}"
          @game-action="handleGameAction"
        />
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, markRaw } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useGameStore } from '@/stores/gameStore';
  
  // Import dynamique des composants de jeux
  import BlancMangerCoco from '@/components/games/single-device/BlancMangerCoco.vue';
  import TTMC from '@/components/games/single-device/TTMC.vue';
  import TimesUp from '@/components/games/single-device/TimesUp.vue';
  import Codenames from '@/components/games/single-device/Codenames.vue';
  import GenericGame from '@/components/games/single-device/GenericGame.vue';
  
  export default {
    name: 'SingleDeviceGame',
    props: {
      id: {
        type: String,
        required: true
      }
    },
    setup(props) {
      const route = useRoute();
      const router = useRouter();
      const gameStore = useGameStore();
      
      const loading = ref(true);
      const error = ref(null);
      const showRules = ref(false);
      
      // Correspondance entre ID de jeu et composants
      const gameComponents = {
        // ID réels des jeux
        '67e3fb2314a26c5599124fba': markRaw(BlancMangerCoco), // Blanc-Manger Coco
        '67e3fb2314a26c5599124fb4': markRaw(TTMC), // Tu Te Mets Combien ?
        '67e3fb2314a26c5599124fbd': markRaw(TimesUp), // Time's Up
        '67e3fb2314a26c5599124fc0': markRaw(Codenames), // Codenames
        
        // Mapping par titre (fallback)
        'Blanc-Manger Coco': markRaw(BlancMangerCoco),
        'Tu Te Mets Combien ?': markRaw(TTMC),
        "Time's Up": markRaw(TimesUp),
        'Codenames': markRaw(Codenames)
      };
      
      const game = computed(() => gameStore.currentGame);
      
      // Déterminer si le jeu est pris en charge et de type "single-device"
      const isSupportedGame = computed(() => {
        if (!game.value) return false;
        return game.value.type === 'single-device';
      });
      
      // Déterminer le composant de jeu à utiliser
      const currentGameComponent = computed(() => {
        if (!game.value) return null;
        
        // Essayer de trouver le composant par ID
        const componentById = gameComponents[props.id];
        if (componentById) return componentById;
        
        // Essayer de trouver le composant par titre
        const componentByTitle = gameComponents[game.value.title];
        if (componentByTitle) return componentByTitle;
        
        // Utiliser le composant générique par défaut
        return markRaw(GenericGame);
      });
      
      // Formater les règles de façon basique (remplacement de marked)
      const simpleFormatRules = computed(() => {
        if (!game.value || !game.value.rulesContent) return '';
        
        // Formatage basique : remplacer les # par des titres, etc.
        let formattedText = game.value.rulesContent
          // Remplacer les liens [texte](url) par des <a>
          .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-indigo-600 hover:underline" target="_blank">$1</a>')
          // Remplacer les titres ## par des h2
          .replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
          // Remplacer les titres # par des h1
          .replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>')
          // Remplacer les listes à puces
          .replace(/^\*\s+(.+)$/gm, '<li class="ml-4">$1</li>')
          // Remplacer les textes en gras
          .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
          // Remplacer les textes en italique
          .replace(/\*([^*]+)\*/g, '<em>$1</em>')
          // Remplacer les retours à la ligne
          .replace(/\n\n/g, '<br><br>');
        
        return formattedText;
      });
      
      // Charger les données du jeu
      onMounted(async () => {
        try {
          await gameStore.fetchGameById(props.id);
          
          if (!gameStore.currentGame) {
            error.value = 'Ce jeu n\'existe pas.';
          }
        } catch (err) {
          console.error('Erreur lors du chargement du jeu:', err);
          error.value = 'Une erreur est survenue lors du chargement du jeu.';
        } finally {
          loading.value = false;
        }
      });
      
      // Gérer les actions du jeu
      const handleGameAction = (action) => {
        console.log('Action du jeu:', action);
        // Traiter les actions spécifiques selon le jeu
      };
      
      return {
        loading,
        error,
        game,
        showRules,
        isSupportedGame,
        currentGameComponent,
        simpleFormatRules,
        handleGameAction
      };
    }
  }
  </script>