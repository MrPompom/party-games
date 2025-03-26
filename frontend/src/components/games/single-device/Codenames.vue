<template>
    <div class="codenames-game min-h-[calc(100vh-64px)] bg-gradient-to-b from-blue-50 to-indigo-100 p-4">
      <!-- Configuration initiale -->
      <div v-if="gameState === 'setup'" class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 class="text-2xl font-bold text-center mb-6">Codenames</h2>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Équipes</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Équipe Rouge -->
            <div class="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 class="font-bold text-red-700 mb-2 flex items-center">
                <span class="w-3 h-3 bg-red-600 rounded-full mr-2"></span>
                Équipe Rouge
              </h4>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Maître-espion
                </label>
                <input 
                  type="text" 
                  v-model="redTeam.spymaster" 
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Nom du maître-espion"
                />
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Agents de terrain
                </label>
                <textarea 
                  v-model="redTeam.agents" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Noms séparés par des virgules"
                ></textarea>
              </div>
            </div>
            
            <!-- Équipe Bleue -->
            <div class="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h4 class="font-bold text-blue-700 mb-2 flex items-center">
                <span class="w-3 h-3 bg-blue-600 rounded-full mr-2"></span>
                Équipe Bleue
              </h4>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Maître-espion
                </label>
                <input 
                  type="text" 
                  v-model="blueTeam.spymaster" 
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nom du maître-espion"
                />
              </div>
              <div class="mb-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Agents de terrain
                </label>
                <textarea 
                  v-model="blueTeam.agents" 
                  rows="2"
                  class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Noms séparés par des virgules"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <h3 class="text-lg font-semibold mb-3">Options de jeu</h3>
          <div class="space-y-4">
            <div>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="options.timerEnabled" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-gray-700">Activer le chronomètre</span>
              </label>
              
              <div v-if="options.timerEnabled" class="ml-6 mt-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Durée du tour (secondes)
                </label>
                <input 
                  type="number" 
                  v-model.number="options.timerDuration" 
                  min="10" 
                  max="180" 
                  step="10" 
                  class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Difficulté des mots
              </label>
              <select 
                v-model="options.difficulty" 
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="easy">Facile</option>
                <option value="medium">Moyenne</option>
                <option value="hard">Difficile</option>
                <option value="mixed">Mixte</option>
              </select>
            </div>
            
            <div>
              <label class="flex items-center">
                <input 
                  type="checkbox" 
                  v-model="options.doubleAgent" 
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <span class="ml-2 text-gray-700">Équipe rouge commence (agent double)</span>
              </label>
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
      
      <!-- Écran du maître-espion (pour voir la grille) -->
      <div v-else-if="gameState === 'spymaster'" class="max-w-4xl mx-auto">
        <!-- Barre d'équipe actuelle -->
        <div 
          class="flex justify-between items-center p-3 mb-4 rounded-lg"
          :class="currentTeam === 'red' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
        >
          <div class="font-bold text-lg">
            <span v-if="currentTeam === 'red'">
              <i class="fas fa-user-secret mr-1"></i> Maître-espion Rouge: {{ redTeam.spymaster }}
            </span>
            <span v-else>
              <i class="fas fa-user-secret mr-1"></i> Maître-espion Bleu: {{ blueTeam.spymaster }}
            </span>
          </div>
          <button 
            @click="gameState = 'playing'"
            class="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            :class="currentTeam === 'red' ? 'border-red-300 text-red-700' : 'border-blue-300 text-blue-700'"
          >
            <i class="fas fa-eye-slash mr-1"></i> Cacher la grille
          </button>
        </div>
        
        <!-- Grille de jeu avec codes couleurs -->
        <div class="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div class="grid grid-cols-5 gap-2">
            <div 
              v-for="(word, index) in words" 
              :key="index"
              class="aspect-[3/2] flex items-center justify-center p-2 rounded-md text-center font-medium relative"
              :class="getCardClassForSpymaster(wordTypes[index])"
            >
              <span>{{ word }}</span>
              <div 
                v-if="revealedCards[index]" 
                class="absolute inset-0 bg-opacity-40 flex items-center justify-center rounded-md"
                :class="getRevealedOverlayClass(wordTypes[index])"
              >
                <i class="fas fa-check text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Compteurs -->
        <div class="flex justify-between mb-4">
          <div class="bg-red-100 px-4 py-2 rounded-lg text-red-800 font-bold">
            Équipe Rouge: {{ cardsLeft.red }} restants
          </div>
          <div class="bg-blue-100 px-4 py-2 rounded-lg text-blue-800 font-bold">
            Équipe Bleue: {{ cardsLeft.blue }} restants
          </div>
        </div>
        
        <!-- Formulaire pour l'indice -->
        <div class="bg-white rounded-lg shadow-md p-4">
          <h3 class="text-lg font-semibold mb-3">Donnez votre indice</h3>
          <div class="flex flex-col sm:flex-row gap-3 mb-4">
            <input 
              type="text" 
              v-model="clue.word" 
              placeholder="Mot-indice" 
              class="flex-grow px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <select 
              v-model="clue.count" 
              class="w-32 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="∞">∞</option>
            </select>
          </div>
          <button 
            @click="submitClue" 
            :disabled="!clue.word || !clue.count"
            class="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Valider l'indice
          </button>
        </div>
      </div>
      
      <!-- Écran de jeu principal -->
      <div v-else-if="gameState === 'playing'" class="max-w-4xl mx-auto">
        <!-- Barre d'équipe actuelle -->
        <div 
          class="flex justify-between items-center p-3 mb-4 rounded-lg"
          :class="currentTeam === 'red' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'"
        >
          <div class="font-bold text-lg">
            <span>Tour de l'équipe {{ currentTeam === 'red' ? 'Rouge' : 'Bleue' }}</span>
          </div>
          <button 
            v-if="currentClue.word"
            class="px-4 py-2 bg-white rounded-md shadow-sm"
            disabled
          >
            Indice: {{ currentClue.word }} ({{ currentClue.count }})
          </button>
          <button 
            v-else-if="isSpymaster"
            @click="gameState = 'spymaster'"
            class="px-4 py-2 bg-white border rounded-md shadow-sm hover:bg-gray-50"
            :class="currentTeam === 'red' ? 'border-red-300 text-red-700' : 'border-blue-300 text-blue-700'"
          >
            <i class="fas fa-eye mr-1"></i> Voir la grille (maître-espion)
          </button>
        </div>
        
        <!-- Indice actuel -->
        <div v-if="currentClue.word" class="bg-white rounded-lg shadow-md p-4 mb-4">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-gray-600">Indice:</span>
              <span class="ml-2 font-bold text-xl">{{ currentClue.word }}</span>
              <span class="ml-2 bg-gray-200 px-2 py-1 rounded-full text-sm">{{ currentClue.count }}</span>
            </div>
            <div class="text-sm text-gray-600">
              {{ guessesLeft }} réponses restantes
            </div>
          </div>
        </div>
        
        <!-- Grille de jeu -->
        <div class="bg-white rounded-lg shadow-lg p-4 mb-6">
          <div class="grid grid-cols-5 gap-2">
            <div 
              v-for="(word, index) in words" 
              :key="index"
              @click="!revealedCards[index] && currentClue.word ? revealCard(index) : null"
              class="aspect-[3/2] flex items-center justify-center p-2 rounded-md text-center font-medium relative cursor-pointer hover:bg-gray-50"
              :class="getCardClass(index)"
            >
              <span>{{ word }}</span>
              <div 
                v-if="revealedCards[index]" 
                class="absolute inset-0 bg-opacity-90 flex items-center justify-center rounded-md"
                :class="getRevealedClass(index)"
              >
                <i class="fas fa-check text-white text-xl"></i>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Compteurs -->
        <div class="flex justify-between mb-4">
          <div class="bg-red-100 px-4 py-2 rounded-lg text-red-800 font-bold">
            Équipe Rouge: {{ cardsLeft.red }} restants
          </div>
          <div class="bg-blue-100 px-4 py-2 rounded-lg text-blue-800 font-bold">
            Équipe Bleue: {{ cardsLeft.blue }} restants
          </div>
        </div>
        
        <!-- Boutons d'action -->
        <div v-if="currentClue.word" class="flex justify-end">
          <button 
            @click="endTurn"
            class="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
          >
            <i class="fas fa-forward mr-1"></i> Passer
          </button>
        </div>
      </div>
      
      <!-- Écran de fin de partie -->
      <div v-else-if="gameState === 'game-over'" class="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div 
            class="text-6xl mb-4"
            :class="winner === 'red' ? 'text-red-600' : 'text-blue-600'"
          >
            <i class="fas fa-trophy"></i>
          </div>
          <h2 class="text-3xl font-bold mb-4">Partie terminée !</h2>
          <p class="text-xl mb-8">
            L'équipe 
            <span 
              class="font-bold"
              :class="winner === 'red' ? 'text-red-600' : 'text-blue-600'"
            >
              {{ winner === 'red' ? 'Rouge' : 'Bleue' }}
            </span> 
            remporte la victoire !
          </p>
          
          <p class="text-gray-600 mb-6">
            {{ winReason }}
          </p>
          
          <div class="flex flex-col sm:flex-row gap-3 justify-center">
            <button 
              @click="newGame" 
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
    name: 'CodenamesGame',
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
        gameState: 'setup', // setup, spymaster, playing, game-over
        redTeam: {
          spymaster: 'Maître-espion Rouge',
          agents: 'Agent 1, Agent 2'
        },
        blueTeam: {
          spymaster: 'Maître-espion Bleu',
          agents: 'Agent 3, Agent 4'
        },
        options: {
          timerEnabled: false,
          timerDuration: 60,
          difficulty: 'medium',
          doubleAgent: true
        },
        words: [],
        wordTypes: [], // red, blue, neutral, assassin
        revealedCards: [],
        currentTeam: 'red',
        clue: {
          word: '',
          count: ''
        },
        currentClue: {
          word: '',
          count: ''
        },
        guessesLeft: 0,
        cardsLeft: {
          red: 0,
          blue: 0
        },
        timer: null,
        timeLeft: 0,
        winner: null,
        winReason: ''
      };
    },
    computed: {
      isSetupValid() {
        return this.redTeam.spymaster && this.blueTeam.spymaster;
      },
      isSpymaster() {
        return (this.currentTeam === 'red' && this.redTeam.spymaster) || 
               (this.currentTeam === 'blue' && this.blueTeam.spymaster);
      }
    },
    methods: {
      startGame() {
        if (!this.isSetupValid) return;
        
        // Initialiser la partie
        this.generateWordGrid();
        this.currentTeam = this.options.doubleAgent ? 'red' : Math.random() < 0.5 ? 'red' : 'blue';
        this.gameState = 'spymaster';
        this.clue = { word: '', count: '' };
        this.currentClue = { word: '', count: '' };
        this.guessesLeft = 0;
        
        // Compter les cartes par équipe
        this.updateCardCounts();
      },
      generateWordGrid() {
        // Liste de mots simples pour le jeu
        const wordPool = [
          'POMME', 'CHIEN', 'CHAT', 'VOITURE', 'MAISON', 'PORTE', 'FENÊTRE', 'ARBRE',
          'FLEUR', 'SOLEIL', 'LUNE', 'ÉTOILE', 'RIVIÈRE', 'OCÉAN', 'MONTAGNE', 'ÉCOLE',
          'LIVRE', 'STYLO', 'TABLE', 'CHAISE', 'TÉLÉPHONE', 'ORDINATEUR', 'MUSIQUE', 'FILM',
          'RESTAURANT', 'PARC', 'HÔPITAL', 'POLICE', 'FEU', 'EAU', 'TERRE', 'AIR',
          'OISEAU', 'POISSON', 'LION', 'TIGRE', 'PAIN', 'FROMAGE', 'CHOCOLAT', 'CAFÉ',
          'THÉ', 'BIÈRE', 'VIN', 'JUS', 'MÉDECIN', 'PROFESSEUR', 'ÉTUDIANT', 'TRAVAIL',
          'ARGENT', 'BANQUE', 'PAYS', 'VILLE', 'VILLAGE', 'ROUTE', 'PONT', 'TRAIN',
          'AVION', 'VÉLO', 'BATEAU', 'HIVER', 'PRINTEMPS', 'ÉTÉ', 'AUTOMNE', 'JOUR',
          'NUIT', 'MATIN', 'SOIR', 'HEURE', 'MINUTE', 'SECONDE', 'ANNÉE', 'MOIS',
          'SEMAINE', 'CORPS', 'TÊTE', 'MAIN', 'PIED', 'ŒIL', 'NEZ', 'BOUCHE',
          'DENT', 'CHEVEUX', 'CŒUR', 'SANG', 'FAMILLE', 'PÈRE', 'MÈRE', 'FRÈRE',
          'SŒUR', 'ENFANT', 'BÉBÉ', 'SPORT', 'FOOTBALL', 'TENNIS', 'NATATION', 'COURSE'
        ];
        
        // Sélectionner 25 mots aléatoires
        this.words = [];
        const shuffledWords = [...wordPool].sort(() => Math.random() - 0.5);
        for (let i = 0; i < 25; i++) {
          this.words.push(shuffledWords[i]);
        }
        
        // Initialiser tous les mots comme non révélés
        this.revealedCards = Array(25).fill(false);
        
        // Assigner les types de cartes
        this.assignCardTypes();
      },
      assignCardTypes() {
        const types = [];
        
        // Déterminer le nombre de cartes de chaque type
        const redCount = this.options.doubleAgent ? 9 : 8;
        const blueCount = this.options.doubleAgent ? 8 : 9;
        const neutralCount = 7;
        const assassinCount = 1;
        
        // Remplir le tableau de types
        for (let i = 0; i < redCount; i++) types.push('red');
        for (let i = 0; i < blueCount; i++) types.push('blue');
        for (let i = 0; i < neutralCount; i++) types.push('neutral');
        for (let i = 0; i < assassinCount; i++) types.push('assassin');
        
        // Mélanger le tableau
        this.wordTypes = types.sort(() => Math.random() - 0.5);
        
        // Mettre à jour les compteurs
        this.cardsLeft.red = redCount;
        this.cardsLeft.blue = blueCount;
      },
      getCardClass(index) {
        // Pour les joueurs, toutes les cartes non révélées ont la même apparence
        if (this.revealedCards[index]) {
          return this.getRevealedClass(index);
        }
        return 'bg-amber-50 border border-amber-200';
      },
      getCardClassForSpymaster(type) {
        // Pour le maître-espion, les cartes sont colorées selon leur type
        switch (type) {
          case 'red': return 'bg-red-100 border border-red-300 text-red-800';
          case 'blue': return 'bg-blue-100 border border-blue-300 text-blue-800';
          case 'neutral': return 'bg-amber-50 border border-amber-200 text-amber-800';
          case 'assassin': return 'bg-gray-800 border border-gray-900 text-white';
          default: return 'bg-white border border-gray-300';
        }
      },
      getRevealedClass(index) {
        const type = this.wordTypes[index];
        return this.getRevealedOverlayClass(type);
      },
      getRevealedOverlayClass(type) {
        switch (type) {
          case 'red': return 'bg-red-600';
          case 'blue': return 'bg-blue-600';
          case 'neutral': return 'bg-amber-600';
          case 'assassin': return 'bg-black';
          default: return 'bg-gray-600';
        }
      },
      submitClue() {
        if (!this.clue.word || !this.clue.count) return;
        
        this.currentClue = { ...this.clue };
        this.guessesLeft = this.clue.count === '∞' ? Infinity : parseInt(this.clue.count) + 1;
        this.clue = { word: '', count: '' };
        this.gameState = 'playing';
      },
      revealCard(index) {
        if (this.revealedCards[index] || !this.currentClue.word) return;
        
        // Révéler la carte
        this.revealedCards[index] = true;
        
        // Vérifier le type de carte
        const cardType = this.wordTypes[index];
        
        // Mettre à jour les compteurs
        if (cardType === 'red') {
          this.cardsLeft.red--;
        } else if (cardType === 'blue') {
          this.cardsLeft.blue--;
        }
        
        // Vérifier si la partie est terminée
        if (this.checkGameOver(cardType)) return;
        
        // Si c'est l'assassin ou une carte neutre, ou d'une autre équipe, fin du tour
        if (cardType === 'assassin' || cardType === 'neutral' || cardType !== this.currentTeam) {
          this.endTurn();
          return;
        }
        
        // Décrémenter le nombre de réponses restantes
        this.guessesLeft--;
        
        // Si le nombre de réponses est épuisé, fin du tour
        if (this.guessesLeft <= 0) {
          this.endTurn();
        }
      },
      checkGameOver(cardType) {
        // Si c'est l'assassin, l'équipe adverse gagne
        if (cardType === 'assassin') {
          this.winner = this.currentTeam === 'red' ? 'blue' : 'red';
          this.winReason = `L'équipe ${this.currentTeam === 'red' ? 'Rouge' : 'Bleue'} a trouvé l'assassin !`;
          this.gameState = 'game-over';
          return true;
        }
        
        // Si une équipe a trouvé toutes ses cartes
        if (this.cardsLeft.red === 0) {
          this.winner = 'red';
          this.winReason = "L'équipe Rouge a trouvé tous ses agents !";
          this.gameState = 'game-over';
          return true;
        }
        
        if (this.cardsLeft.blue === 0) {
          this.winner = 'blue';
          this.winReason = "L'équipe Bleue a trouvé tous ses agents !";
          this.gameState = 'game-over';
          return true;
        }
        
        return false;
      },
      endTurn() {
        // Passer à l'équipe suivante
        this.currentTeam = this.currentTeam === 'red' ? 'blue' : 'red';
        this.currentClue = { word: '', count: '' };
        this.guessesLeft = 0;
        this.gameState = 'spymaster';
      },
      updateCardCounts() {
        let redCount = 0;
        let blueCount = 0;
        
        this.wordTypes.forEach((type, index) => {
          if (!this.revealedCards[index]) {
            if (type === 'red') redCount++;
            else if (type === 'blue') blueCount++;
          }
        });
        
        this.cardsLeft.red = redCount;
        this.cardsLeft.blue = blueCount;
      },
      newGame() {
        // Commencer une nouvelle partie avec les mêmes paramètres
        this.generateWordGrid();
        this.currentTeam = this.options.doubleAgent ? 'red' : Math.random() < 0.5 ? 'red' : 'blue';
        this.gameState = 'spymaster';
        this.clue = { word: '', count: '' };
        this.currentClue = { word: '', count: '' };
        this.guessesLeft = 0;
        this.winner = null;
        this.winReason = '';
        
        // Mettre à jour les compteurs
        this.updateCardCounts();
      },
      returnToSetup() {
        this.gameState = 'setup';
        this.winner = null;
        this.winReason = '';
      }
    }
  }
  </script>