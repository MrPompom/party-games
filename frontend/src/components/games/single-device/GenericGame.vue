<template>
    <div class="generic-game min-h-[calc(100vh-64px)] bg-gray-100 flex flex-col">
      <div class="flex-grow flex flex-col items-center justify-center p-6">
        <div class="max-w-lg w-full bg-white rounded-lg shadow-md p-6 text-center">
          <div class="text-gray-400 text-6xl mb-6">
            <i class="fas fa-gamepad"></i>
          </div>
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ game.title }}</h2>
          <p class="text-gray-600 mb-6">
            Ce jeu est en cours de développement et sera bientôt disponible en version interactive.
          </p>
          <p class="text-gray-700 mb-8">
            Pour l'instant, vous pouvez consulter les règles en cliquant sur le bouton "Règles" en haut de l'écran.
          </p>
          <button 
            @click="startGame" 
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <i class="fas fa-play mr-2"></i> Commencer une partie
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GenericGame',
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
    methods: {
      startGame() {
        this.$emit('game-action', { type: 'start-game' });
        alert(`Démarrage d'une partie de ${this.game.title}. Cette fonctionnalité est en cours de développement.`);
      }
    }
  }
  </script>