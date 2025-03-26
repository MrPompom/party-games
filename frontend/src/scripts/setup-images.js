/**
 * Script pour créer les répertoires d'images et générer des images placeholder
 * Utilisation : node scripts/setup-images.js
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Répertoires à créer
const directories = [
  'public/images',
  'public/images/games'
];

// Liste des images placeholder à créer
const placeholders = [
  { 
    name: 'public/images/games/game-placeholder.jpg',
    width: 600,
    height: 400,
    bgColor: '#E5E7EB',
    text: 'Jeu'
  },
  { 
    name: 'public/images/games/rules-placeholder.jpg',
    width: 600,
    height: 400,
    bgColor: '#BFDBFE',
    text: 'Règles'
  },
  { 
    name: 'public/images/games/device-placeholder.jpg',
    width: 600,
    height: 400,
    bgColor: '#BBF7D0',
    text: 'Jeu sur appareil'
  },
  { 
    name: 'public/images/games/multiplayer-placeholder.jpg',
    width: 600,
    height: 400,
    bgColor: '#DDD6FE',
    text: 'Multijoueur'
  },
  { 
    name: 'public/images/games/werewolf.jpg',
    width: 600,
    height: 400,
    bgColor: '#C4B5FD',
    text: 'Loup-Garou'
  },
  { 
    name: 'public/images/games/poker.jpg',
    width: 600,
    height: 400,
    bgColor: '#FEE2E2',
    text: 'Poker'
  },
  { 
    name: 'public/images/games/ttmc.jpg',
    width: 600,
    height: 400,
    bgColor: '#FEF3C7',
    text: 'TTMC'
  },
  { 
    name: 'public/images/games/blanc-manger-coco.jpg',
    width: 600,
    height: 400,
    bgColor: '#FEE2E2',
    text: 'Blanc-Manger Coco'
  },
  { 
    name: 'public/images/games/times-up.jpg',
    width: 600,
    height: 400,
    bgColor: '#FED7AA',
    text: 'Time\'s Up'
  },
  { 
    name: 'public/images/games/codenames.jpg',
    width: 600,
    height: 400,
    bgColor: '#BAE6FD',
    text: 'Codenames'
  }
];

// Créer les répertoires
directories.forEach(dir => {
  const fullPath = path.resolve(dir);
  if (!fs.existsSync(fullPath)) {
    console.log(`Création du répertoire: ${fullPath}`);
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Fonction pour créer une image placeholder
function createPlaceholderImage(options) {
  const { name, width, height, bgColor, text } = options;
  const fullPath = path.resolve(name);
  
  // Vérifier si l'image existe déjà
  if (fs.existsSync(fullPath)) {
    console.log(`L'image existe déjà: ${fullPath}`);
    return;
  }
  
  console.log(`Création de l'image placeholder: ${fullPath}`);
  
  // Créer un canvas
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  
  // Dessiner l'arrière-plan
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  
  // Ajouter le texte
  ctx.fillStyle = '#374151';
  ctx.font = '24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2);
  
  // Ajouter une bordure
  ctx.strokeStyle = '#9CA3AF';
  ctx.lineWidth = 4;
  ctx.strokeRect(2, 2, width - 4, height - 4);
  
  // Enregistrer l'image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(fullPath, buffer);
}

// Créer toutes les images placeholder
try {
  placeholders.forEach(createPlaceholderImage);
  console.log('Toutes les images placeholder ont été créées avec succès.');
} catch (error) {
  console.error('Erreur lors de la création des images:', error);
}