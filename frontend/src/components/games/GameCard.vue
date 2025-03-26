<template>
  <Card 
    :clickable="true" 
    @click="$emit('click')"
    class="h-full flex flex-col"
  >
    <template #image>
      <div class="relative">
        <img 
          :src="thumbnailUrl" 
          :alt="game.title"
          class="w-full h-48 object-cover bg-gray-200"
          @error="handleImageError"
        />
        <div 
          class="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 text-xs rounded"
          :class="typeColorClass"
        >
          {{ typeLabels[game.type] || game.type }}
        </div>
      </div>
    </template>
    
    <template #content>
      <div class="flex flex-col flex-grow">
        <h3 class="text-lg font-bold mb-1">{{ game.title }}</h3>
        
        <p class="text-gray-600 text-sm mb-3 flex-grow">{{ truncateDescription }}</p>
        
        <div class="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          <div class="flex items-center">
            <i class="fas fa-users text-gray-400 mr-1"></i>
            <span class="text-sm text-gray-600">{{ game.minPlayers }}-{{ game.maxPlayers }}</span>
          </div>
          
          <div class="flex items-center">
            <i class="fas fa-clock text-gray-400 mr-1"></i>
            <span class="text-sm text-gray-600">{{ game.duration }} min</span>
          </div>
          
          <div class="flex items-center">
            <i class="fas fa-star text-yellow-400 mr-1"></i>
            <span class="text-sm text-gray-600">{{ game.popularity }}</span>
          </div>
        </div>
      </div>
    </template>
  </Card>
</template>

<script>
import Card from '@/components/ui/Card.vue';

export default {
  name: 'GameCard',
  components: {
    Card
  },
  props: {
    game: {
      type: Object,
      required: true,
      validator: game => {
        // Vérifier que les propriétés essentielles sont présentes (id peut être _id)
        return (game.id || game._id) && game.title && game.type;
      }
    }
  },
  emits: ['click'],
  data() {
    return {
      imageError: false
    };
  },
  computed: {
    typeLabels() {
      return {
        'rules': 'Règles',
        'single-device': '1 Appareil',
        'multiplayer': 'Multijoueur'
      };
    },
    typeColorClass() {
      const classes = {
        'rules': 'bg-blue-600',
        'single-device': 'bg-green-600',
        'multiplayer': 'bg-purple-600'
      };
      
      return classes[this.game.type] || 'bg-gray-600';
    },
    truncateDescription() {
      if (!this.game.description) return '';
      return this.game.description.length > 80 
        ? this.game.description.substring(0, 80) + '...' 
        : this.game.description;
    },
    thumbnailUrl() {
      // Vérifier si l'URL est une URL d'exemple (qui ne fonctionnera pas)
      if (this.imageError || (this.game.thumbnail && this.game.thumbnail.includes('example.com'))) {
        // Utiliser une image de secours basée sur le type de jeu
        const typeImages = {
          'rules': '/images/games/rules-placeholder.jpg',
          'single-device': '/images/games/device-placeholder.jpg',
          'multiplayer': '/images/games/multiplayer-placeholder.jpg'
        };
        
        // Retourner l'image spécifique ou une image générique
        return typeImages[this.game.type] || '/images/games/game-placeholder.jpg';
      }
      
      return this.game.thumbnail || '/images/games/game-placeholder.jpg';
    }
  },
  methods: {
    handleImageError() {
      this.imageError = true;
    }
  }
};
</script>