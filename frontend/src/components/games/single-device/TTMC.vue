<template>
    <div class="ttmc-game min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-indigo-100">
      <!-- Configuration initiale -->
      <div v-if="gameState === 'setup'" class="p-6">
        <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 class="text-2xl font-bold text-center mb-6">Tu Te Mets Combien ?</h2>
          
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-3">Joueurs</h3>
            <div class="space-y-3">
              <div 
                v-for="(player, index) in players" 
                :key="index"
                class="flex items-center gap-3"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center"
                  :class="playerColors[index % playerColors.length]"
                >
                  <span class="text-white font-bold">{{ index + 1 }}</span>
                </div>
                <input 
                  type="text" 
                  v-model="players[index].name" 
                  class="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nom du joueur"
                  required
                />
                <button 
                  v-if="players.length > 2" 
                  @click="removePlayer(index)" 
                  class="text-red-500 hover:text-red-700"
                  title="Supprimer ce joueur"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
            
            <div class="mt-3">
              <button 
                v-if="players.length < 8" 
                @click="addPlayer" 
                class="mt-2 flex items-center text-indigo-600 hover:text-indigo-800"
              >
                <i class="fas fa-plus-circle mr-1"></i> Ajouter un joueur
              </button>
            </div>
          </div>
          
          <div class="mb-8">
            <h3 class="text-lg font-semibold mb-3">Options</h3>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Catégories
                </label>
                <div class="border border-gray-300 rounded-md p-2 h-48 overflow-y-auto">
                  <div 
                    v-for="(category, index) in availableCategories" 
                    :key="index"
                    class="flex items-center mb-2"
                  >
                    <input 
                      type="checkbox" 
                      :id="`category-${index}`" 
                      v-model="selectedCategories" 
                      :value="category" 
                      class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label :for="`category-${index}`" class="ml-2 block text-sm text-gray-700">
                      {{ category }}
                    </label>
                  </div>
                </div>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Objectif de points
                </label>
                <input 
                  type="number" 
                  v-model.number="targetScore" 
                  min="10" 
                  max="100" 
                  step="5" 
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                
                <label class="block text-sm font-medium text-gray-700 mt-4 mb-1">
                  Difficulté maximale
                </label>
                <div class="flex items-center justify-between">
                  <input 
                    type="range" 
                    v-model.number="maxDifficulty" 
                    min="1" 
                    max="10" 
                    step="1" 
                    class="w-4/5 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span class="ml-2 bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center">
                    {{ maxDifficulty }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div class="flex justify-center">
            <button 
              @click="startGame" 
              :disabled="!isSetupValid"
              class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i class="fas fa-play mr-2"></i> Commencer la partie
            </button>
          </div>
        </div>
      </div>
      
      <!-- Jeu en cours -->
      <div v-else-if="gameState === 'playing'" class="p-4">
        <div class="max-w-4xl mx-auto">
          <!-- Tableau de scores -->
          <div class="bg-white rounded-lg shadow-md p-4 mb-4">
            <h3 class="text-lg font-semibold mb-2">Scores</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div 
                v-for="(player, index) in players" 
                :key="index"
                class="flex items-center gap-2 p-2 rounded"
                :class="{ 'bg-yellow-100': currentPlayerIndex === index }"
              >
                <div 
                  class="w-6 h-6 rounded-full flex items-center justify-center"
                  :class="playerColors[index % playerColors.length]"
                >
                  <span class="text-white text-xs font-bold">{{ index + 1 }}</span>
                </div>
                <div class="flex-grow truncate">{{ player.name }}</div>
                <div class="font-bold">{{ player.score }}</div>
              </div>
            </div>
          </div>
          
          <!-- Tour actuel -->
          <div class="bg-white rounded-lg shadow-md p-6">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-xl font-bold">
                Au tour de: 
                <span :class="`text-${playerBaseColors[currentPlayerIndex % playerColors.length]}-600`">
                  {{ players[currentPlayerIndex].name }}
                </span>
              </h3>
              <div class="text-sm text-gray-500">
                Objectif: {{ targetScore }} points
              </div>
            </div>
            
            <!-- Catégorie et niveau de difficulté -->
            <div v-if="currentQuestion && !showingAnswer">
              <div class="mb-6 text-center">
                <h4 class="text-lg font-semibold mb-3">Catégorie: {{ currentQuestion.category }}</h4>
                <p class="text-gray-600 mb-4">Tu te mets combien en {{ currentQuestion.category }} ?</p>
                
                <div class="max-w-md mx-auto">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm text-gray-500">Facile</span>
                    <span class="text-sm text-gray-500">Difficile</span>
                  </div>
                  <div class="flex justify-between space-x-2">
                    <button
                      v-for="level in maxDifficulty" 
                      :key="level"
                      @click="selectDifficulty(level)"
                      class="w-full py-3 rounded transition"
                      :class="difficulty === level 
                        ? `bg-${playerBaseColors[currentPlayerIndex % playerColors.length]}-600 text-white` 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
                    >
                      {{ level }}
                    </button>
                  </div>
                </div>
              </div>
              
              <div v-if="difficulty" class="mt-8">
                <div class="bg-gray-100 p-4 rounded-lg mb-4">
                  <h4 class="font-bold mb-2">Question (niveau {{ difficulty }}):</h4>
                  <p class="text-lg">{{ currentQuestion.question }}</p>
                </div>
                
                <div class="flex justify-end space-x-4">
                  <button 
                    @click="answerQuestion(false)" 
                    class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  >
                    <i class="fas fa-times mr-1"></i> Incorrect
                  </button>
                  <button 
                    @click="answerQuestion(true)" 
                    class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  >
                    <i class="fas fa-check mr-1"></i> Correct
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Affichage de la réponse -->
            <div v-else-if="showingAnswer" class="text-center">
              <div class="bg-gray-100 p-4 rounded-lg mb-6">
                <h4 class="font-bold mb-2">Réponse:</h4>
                <p class="text-lg">{{ currentQuestion.answer }}</p>
              </div>
              
              <div v-if="lastAnswerCorrect !== null" class="mb-6">
                <div v-if="lastAnswerCorrect" class="text-green-600 font-bold text-xl">
                  <i class="fas fa-check-circle mr-1"></i> Bonne réponse !
                  <p class="text-lg font-normal">
                    {{ players[currentPlayerIndex].name }} gagne {{ difficulty }} points.
                  </p>
                </div>
                <div v-else class="text-red-600 font-bold text-xl">
                  <i class="fas fa-times-circle mr-1"></i> Mauvaise réponse !
                  <p class="text-lg font-normal">
                    Aucun point gagné.
                  </p>
                </div>
              </div>
              
              <button 
                @click="nextTurn" 
                class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                Tour suivant
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fin de la partie -->
      <div v-else-if="gameState === 'game-over'" class="p-6 flex items-center justify-center min-h-[calc(100vh-64px)]">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="text-6xl text-yellow-500 mb-4">
            <i class="fas fa-trophy"></i>
          </div>
          <h2 class="text-3xl font-bold mb-2">Partie terminée !</h2>
          <p class="text-xl mb-8">
            <span class="font-bold text-indigo-600">{{ winner.name }}</span> remporte la partie avec {{ winner.score }} points !
          </p>
          
          <h3 class="text-xl font-semibold mb-3">Classement final</h3>
          <div class="space-y-2 mb-8">
            <div 
              v-for="(player, index) in sortedPlayers" 
              :key="player.name"
              class="flex items-center gap-3 p-3 rounded"
              :class="index === 0 ? 'bg-yellow-100' : 'bg-gray-100'"
            >
              <div class="font-bold w-5">{{ index + 1 }}</div>
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center"
                :class="playerColors[players.findIndex(p => p.name === player.name) % playerColors.length]"
              >
                <span class="text-white text-xs font-bold">
                  {{ players.findIndex(p => p.name === player.name) + 1 }}
                </span>
              </div>
              <div class="flex-grow text-left">{{ player.name }}</div>
              <div class="font-bold">{{ player.score }} pts</div>
            </div>
          </div>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="restartGame" 
              class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              <i class="fas fa-redo mr-1"></i> Nouvelle partie
            </button>
            <button 
              @click="returnToSetup" 
              class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition"
            >
              <i class="fas fa-cog mr-1"></i> Modifier les paramètres
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TTMCGame',
    props: {
      game: {
        type: Object,
        required: true
      },
      gameData: {
        type: Object,
        default: () => ({})
      }
    },
    emits: ['game-action'],
    data() {
      return {
        gameState: 'setup', // setup, playing, game-over
        players: [
          { name: 'Joueur 1', score: 0 },
          { name: 'Joueur 2', score: 0 }
        ],
        currentPlayerIndex: 0,
        targetScore: 30,
        maxDifficulty: 8,
        difficulty: null,
        availableCategories: [
          'Cinéma', 'Musique', 'Sport', 'Histoire', 'Géographie',
          'Sciences', 'Cuisine', 'Art', 'Littérature', 'Mythologie',
          'Technologie', 'Jeux vidéo', 'Télévision', 'Animaux', 'Nature'
        ],
        selectedCategories: [],
        currentQuestion: null,
        showingAnswer: false,
        lastAnswerCorrect: null,
        // Couleurs pour les joueurs
        playerColors: [
          'bg-blue-600', 'bg-red-600', 'bg-green-600', 'bg-yellow-600',
          'bg-purple-600', 'bg-pink-600', 'bg-indigo-600', 'bg-teal-600'
        ],
        playerBaseColors: [
          'blue', 'red', 'green', 'yellow', 'purple', 'pink', 'indigo', 'teal'
        ]
      };
    },
    computed: {
      isSetupValid() {
        // Vérifier si tous les joueurs ont un nom
        const allPlayersHaveNames = this.players.every(player => player.name.trim() !== '');
        // Vérifier si au moins une catégorie est sélectionnée
        const hasCategories = this.selectedCategories.length > 0;
        
        return allPlayersHaveNames && hasCategories;
      },
      winner() {
        if (this.gameState !== 'game-over') return null;
        
        return this.players.reduce((highest, player) => 
          player.score > highest.score ? player : highest
        , { score: -1 });
      },
      sortedPlayers() {
        return [...this.players].sort((a, b) => b.score - a.score);
      }
    },
    created() {
      // Initialiser les catégories à partir des données du jeu si disponibles
      if (this.gameData && this.gameData.categories) {
        this.availableCategories = [...this.gameData.categories];
      }
      
      // Sélectionner toutes les catégories par défaut
      this.selectedCategories = [...this.availableCategories];
    },
    methods: {
      addPlayer() {
        if (this.players.length < 8) {
          this.players.push({ name: `Joueur ${this.players.length + 1}`, score: 0 });
        }
      },
      removePlayer(index) {
        if (this.players.length > 2) {
          this.players.splice(index, 1);
        }
      },
      startGame() {
        if (!this.isSetupValid) return;
        
        this.gameState = 'playing';
        this.currentPlayerIndex = 0;
        
        // Réinitialiser les scores
        this.players.forEach(player => {
          player.score = 0;
        });
        
        // Générer la première question
        this.generateQuestion();
      },
      selectDifficulty(level) {
        this.difficulty = level;
        this.currentQuestion.question = this.generateQuestionForDifficulty(this.currentQuestion.category, level);
      },
      generateQuestion() {
        // Choisir une catégorie aléatoire parmi les sélectionnées
        const category = this.selectedCategories[Math.floor(Math.random() * this.selectedCategories.length)];
        
        this.currentQuestion = {
          category,
          question: '', // Sera défini quand le joueur choisira un niveau
          answer: this.generateAnswer(category)
        };
        
        this.difficulty = null;
        this.showingAnswer = false;
        this.lastAnswerCorrect = null;
      },
      generateQuestionForDifficulty(category, level) {
        // Simuler des questions de différents niveaux
        const questions = {
          'Cinéma': [
            "Citez un film de Steven Spielberg",
            "Qui a joué Harry Potter dans les films ?",
            "En quelle année est sorti le film Titanic ?",
            "Quel acteur a remporté le plus d'Oscars ?",
            "Citez trois films de la Nouvelle Vague française",
            "Quels sont les réalisateurs du mouvement Dogme 95 ?",
            "Qui a écrit le scénario original de Pulp Fiction ?",
            "Quels films ont remporté à la fois l'Oscar, le BAFTA, le César et le Golden Globe du meilleur film ?",
            "Citez les 8 films de la Dollars Trilogy et des films Zatoichi",
            "Décrivez l'influence du cinéma expressionniste allemand sur le film noir américain des années 40"
          ],
          'Musique': [
            "Nommez un membre des Beatles",
            "Quel instrument joue un pianiste ?",
            "Qui a chanté 'Billie Jean' ?",
            "Citez trois genres de musique électronique",
            "Quel compositeur a écrit les Quatre Saisons ?",
            "Quels sont les instruments de la famille des cuivres ?",
            "Expliquez la différence entre le solfège et l'harmonie",
            "Comment fonctionne la gamme dodécaphonique ?",
            "Décrivez l'évolution du bebop au hard bop dans le jazz des années 50",
            "Analysez l'influence de la musique atonale sur les compositions post-modernes"
          ]
        };
  
        // Pour les catégories non définies, générer une question générique
        if (!questions[category]) {
          return `Question de niveau ${level} sur ${category}. Plus le niveau est élevé, plus la question est difficile.`;
        }
  
        // Retourner la question correspondant au niveau (ou la dernière si le niveau est trop élevé)
        return questions[category][Math.min(level - 1, questions[category].length - 1)];
      },
      generateAnswer(category) {
        // Simuler des réponses
        const answers = {
          'Cinéma': "Réponse sur le cinéma (À adapter selon la question)",
          'Musique': "Réponse sur la musique (À adapter selon la question)",
          'Sport': "Réponse sur le sport",
          'Histoire': "Réponse sur l'histoire",
          'Géographie': "Réponse sur la géographie",
          'Sciences': "Réponse sur les sciences",
          'Cuisine': "Réponse sur la cuisine",
          'Art': "Réponse sur l'art",
          'Littérature': "Réponse sur la littérature",
          'Mythologie': "Réponse sur la mythologie"
        };
  
        return answers[category] || `Réponse sur ${category}`;
      },
      answerQuestion(isCorrect) {
        this.showingAnswer = true;
        this.lastAnswerCorrect = isCorrect;
        
        // Attribuer les points si la réponse est correcte
        if (isCorrect) {
          this.players[this.currentPlayerIndex].score += this.difficulty;
        }
      },
      nextTurn() {
        // Vérifier si un joueur a atteint le score cible
        if (this.players.some(player => player.score >= this.targetScore)) {
          this.gameState = 'game-over';
          return;
        }
        
        // Passer au joueur suivant
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        
        // Générer une nouvelle question
        this.generateQuestion();
      },
      restartGame() {
        // Commencer une nouvelle partie avec les mêmes paramètres
        this.players.forEach(player => {
          player.score = 0;
        });
        
        this.currentPlayerIndex = 0;
        this.gameState = 'playing';
        this.generateQuestion();
      },
      returnToSetup() {
        // Retourner à l'écran de configuration
        this.gameState = 'setup';
      }
    }
  }
  </script>