<template>
    <div class="blanc-manger-coco min-h-[calc(100vh-64px)] bg-gradient-to-b from-gray-50 to-red-50 p-4">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-center mb-6">Blanc-Manger Coco</h2>
        
        <div class="text-center mb-8">
          <div class="text-5xl text-gray-300 mb-4">
            <i class="fas fa-tools"></i>
          </div>
          <p class="text-gray-600 mb-4">
            Ce jeu est en cours de développement. Il sera disponible prochainement !
          </p>
          <p class="text-gray-500 mb-6">
            Blanc-Manger Coco est un jeu d'humour où vous complétez des phrases absurdes avec vos cartes réponses.
          </p>
        </div>
        
        <div class="border-t border-gray-200 pt-6 mt-6">
          <h3 class="font-bold text-lg mb-3">En attendant, voici comment jouer :</h3>
          <ol class="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Chaque joueur reçoit 7 cartes réponses</li>
            <li>À chaque tour, un joueur est désigné comme le "lecteur" et pioche une carte question</li>
            <li>Tous les autres joueurs choisissent parmi leurs cartes réponses celle qui complète le mieux la phrase</li>
            <li>Les réponses sont mélangées puis lues à haute voix par le lecteur</li>
            <li>Le lecteur choisit sa réponse préférée, et le joueur qui l'a proposée gagne la manche</li>
            <li>Le rôle de lecteur passe au joueur suivant</li>
          </ol>
        </div>
        
        <div class="mt-8 flex justify-center">
          <button 
            @click="notifyDev" 
            class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            <i class="fas fa-bell mr-2"></i> Me notifier quand disponible
          </button>
        </div>
      </div>
      
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h3 class="font-bold text-lg mb-4">Exemples de cartes</h3>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 class="font-bold text-amber-800 mb-2">Carte Question</h4>
            <p class="text-gray-800">
              Ma dernière visite médicale a été gâchée par _________________.
            </p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">Carte Réponse</h4>
            <p class="text-gray-800">
              un médecin qui chuchotait "jackpot" en m'examinant.
            </p>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h4 class="font-bold text-amber-800 mb-2">Carte Question</h4>
            <p class="text-gray-800">
              Pour mon prochain anniversaire, j'aimerais recevoir _________________.
            </p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-bold text-blue-800 mb-2">Carte Réponse</h4>
            <p class="text-gray-800">
              une intervention des forces spéciales.
            </p>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'BlancMangerCocoGame',
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
      notifyDev() {
        this.$emit('game-action', { type: 'notify-development' });
        alert("Votre demande a été enregistrée ! Vous serez notifié dès que le jeu sera disponible.");
      }
    }
  }
  </script>