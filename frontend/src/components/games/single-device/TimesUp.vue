<template>
    <div class="times-up-game min-h-[calc(100vh-64px)] bg-gradient-to-b from-yellow-50 to-orange-50 p-4">
      <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-2xl font-bold text-center mb-6">Time's Up!</h2>
        
        <div class="text-center mb-8">
          <div class="text-5xl text-gray-300 mb-4">
            <i class="fas fa-hourglass-half"></i>
          </div>
          <p class="text-gray-600 mb-4">
            Ce jeu est en cours de développement. Il sera disponible prochainement !
          </p>
          <p class="text-gray-500 mb-6">
            Time's Up est un jeu de devinettes en équipe qui se joue en trois manches avec des contraintes croissantes.
          </p>
        </div>
        
        <div class="border-t border-gray-200 pt-6 mt-6">
          <h3 class="font-bold text-lg mb-3">En attendant, voici comment jouer :</h3>
          <ol class="list-decimal pl-5 space-y-2 text-gray-700">
            <li>Formez deux équipes et choisissez 40 cartes de célébrités</li>
            <li><strong>Première manche :</strong> Chaque joueur a 30 secondes pour faire deviner autant de célébrités que possible à son équipe en utilisant des mots (sauf le nom à deviner)</li>
            <li><strong>Deuxième manche :</strong> Même chose, mais avec un seul mot par célébrité</li>
            <li><strong>Troisième manche :</strong> Même chose, mais uniquement par mime</li>
            <li>L'équipe qui a deviné le plus de célébrités au total gagne</li>
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
        <h3 class="font-bold text-lg mb-4">Exemples de célébrités</h3>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div 
            v-for="(celebrity, index) in celebrities" 
            :key="index"
            class="bg-orange-50 border border-orange-200 rounded-lg p-3 text-center"
          >
            <div class="font-bold text-orange-800">{{ celebrity }}</div>
          </div>
        </div>
        
        <div class="mt-8">
          <h3 class="font-bold text-lg mb-3">Conseils pour jouer</h3>
          <ul class="list-disc pl-5 space-y-2 text-gray-700">
            <li>Préparez un chronomètre pour mesurer les 30 secondes</li>
            <li>Les cartes devinées sont conservées pour le tour suivant</li>
            <li>Notez les scores après chaque manche</li>
            <li>Pour le mime, aucun son n'est autorisé</li>
            <li>Amusez-vous et soyez créatifs dans vos descriptions !</li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'TimesUpGame',
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
        celebrities: [
          'Albert Einstein',
          'Marilyn Monroe',
          'Michael Jackson',
          'Marie Curie',
          'Charlie Chaplin',
          'Napoléon Bonaparte',
          'Léonard de Vinci',
          'Elvis Presley',
          'Cléopâtre',
          'Nelson Mandela',
          'Frida Kahlo',
          'Walt Disney'
        ]
      }
    },
    methods: {
      notifyDev() {
        this.$emit('game-action', { type: 'notify-development' });
        alert("Votre demande a été enregistrée ! Vous serez notifié dès que le jeu sera disponible.");
      }
    }
  }
  </script>