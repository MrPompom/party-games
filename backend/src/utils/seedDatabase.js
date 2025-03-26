/*
node seedDatabase.js : Ajoute les données sans effacer l'existant
node seedDatabase.js --reset : Réinitialise complètement la base de données
node seedDatabase.js --help : Affiche l'aide
*/


const mongoose = require('mongoose');
const User = require('../models/User');
const Game = require('../models/Game');
const Room = require('../models/Room');
require('dotenv').config();

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/party-games')
  .then(() => console.log('Connecté à MongoDB pour initialisation'))
  .catch(err => {
    console.error('Erreur de connexion MongoDB:', err);
    process.exit(1);
  });

// Données de démonstration - Jeux
const gamesData = [
  {
    title: 'Loup-Garou',
    description: 'Démasquez les loups-garous avant qu\'ils ne dévorent tout le village',
    longDescription: `Dans le jeu du Loup-Garou, les joueurs incarnent soit des villageois, soit des loups-garous. Les loups-garous se réveillent la nuit pour dévorer un villageois, tandis que les villageois tentent de les démasquer pendant la journée. Le but des villageois est d'éliminer tous les loups-garous, et inversement.

Le jeu se déroule en alternant phases de jour et phases de nuit. Certains villageois possèdent des pouvoirs spéciaux qui les aident dans leur quête, comme la voyante qui peut connaître l'identité d'un joueur chaque nuit.`,
    howToPlay: `1. Un modérateur attribue secrètement un rôle à chaque joueur
2. Le jeu alterne entre phases de nuit (où les loups-garous choisissent une victime) et phases de jour (où les villageois débattent et votent pour éliminer un suspect)
3. Chaque jour, les joueurs débattent pour tenter d'identifier les loups-garous et votent pour éliminer un suspect
4. Chaque nuit, les loups-garous choisissent une victime et les personnages spéciaux utilisent leurs pouvoirs
5. Le jeu continue jusqu'à ce que tous les loups-garous soient éliminés (victoire des villageois) ou que le nombre de loups-garous soit égal au nombre de villageois (victoire des loups-garous)`,
    type: 'multiplayer',
    minPlayers: 8,
    maxPlayers: 18,
    duration: 30,
    thumbnail: 'https://example.com/images/werewolf.jpg',
    difficulty: 2,
    categories: ['Social', 'Déduction', 'Bluff'],
    popularity: 4.8,
    gameData: {
      roles: [
        {name: 'Villageois', team: 'villageois', description: 'Simple villageois sans pouvoir'},
        {name: 'Loup-Garou', team: 'loups', description: 'Se réveille la nuit pour dévorer un villageois'},
        {name: 'Voyante', team: 'villageois', description: 'Peut connaître l\'identité d\'un joueur chaque nuit'},
        {name: 'Sorcière', team: 'villageois', description: 'Dispose d\'une potion de vie et d\'une potion de mort'}
      ]
    }
  },
  {
    title: 'Tu Te Mets Combien ?',
    description: 'Testez vos connaissances et celles de vos amis dans ce quiz endiablé',
    longDescription: `TTMC (Tu Te Mets Combien ?) est un jeu de quiz où les joueurs évaluent leurs connaissances sur divers sujets. Avant de répondre à une question, chaque joueur doit estimer son niveau de connaissance sur le sujet, ce qui déterminera la difficulté de la question.

Plus vous visez haut, plus la question sera difficile et plus de points vous pourrez gagner... ou perdre ! C'est un jeu qui mêle connaissances générales et confiance en soi.`,
    howToPlay: `1. À votre tour, tirez une carte comportant un thème
2. Évaluez votre niveau de connaissance sur ce thème de 1 à 10
3. Répondez à la question correspondant au niveau que vous avez choisi
4. Si vous répondez correctement, avancez votre pion du nombre de cases correspondant à votre niveau
5. Si vous vous trompez, vous ne gagnez rien
6. Le premier joueur à atteindre la fin du parcours gagne la partie`,
    type: 'single-device',
    minPlayers: 2,
    maxPlayers: 8,
    duration: 45,
    thumbnail: 'https://example.com/images/ttmc.jpg',
    difficulty: 1,
    categories: ['Quiz', 'Connaissances', 'Party game'],
    popularity: 4.6,
    gameData: {
      categories: ['Cinéma', 'Musique', 'Sport', 'Histoire', 'Géographie', 'Sciences', 'Cuisine', 'Art', 'Littérature', 'Mythologie']
    }
  },
  {
    title: 'Poker',
    description: 'Règles complètes du Texas Hold\'em et autres variantes de poker',
    longDescription: `Le poker est un jeu de cartes qui se joue avec un jeu de 52 cartes. Le Texas Hold'em est la variante la plus populaire, où chaque joueur reçoit deux cartes privatives et utilise cinq cartes communes pour former la meilleure main de poker possible.

Le jeu combine stratégie, psychologie et probabilités. Les joueurs misent sur la valeur de leur main, et peuvent bluffer pour faire croire qu'ils ont une meilleure main qu'en réalité.`,
    howToPlay: `1. Chaque joueur reçoit 2 cartes face cachée (cartes privatives)
2. Un premier tour d'enchères a lieu
3. 3 cartes communes sont révélées face visible (le flop), suivi d'un tour d'enchères
4. Une 4e carte commune est révélée (le tournant), suivi d'un tour d'enchères
5. Une 5e carte commune est révélée (la rivière), suivi d'un dernier tour d'enchères
6. Les joueurs encore en jeu révèlent leurs cartes et le meilleur jeu remporte le pot`,
    type: 'rules',
    minPlayers: 2,
    maxPlayers: 10,
    duration: 60,
    thumbnail: 'https://example.com/images/poker.jpg',
    difficulty: 3,
    categories: ['Cartes', 'Stratégie', 'Bluff'],
    popularity: 4.5,
    rulesContent: `
# Règles du Texas Hold'em

## Ordre des mains de poker (de la plus forte à la plus faible)
1. **Quinte flush royale** : As, Roi, Dame, Valet, 10 de la même couleur
2. **Quinte flush** : 5 cartes de la même couleur qui se suivent
3. **Carré** : 4 cartes de même valeur
4. **Full** : Un brelan et une paire
5. **Couleur** : 5 cartes de la même couleur
6. **Suite** : 5 cartes qui se suivent
7. **Brelan** : 3 cartes de même valeur
8. **Deux paires** : Deux paires différentes
9. **Paire** : 2 cartes de même valeur
10. **Carte haute** : La carte la plus haute si aucune autre combinaison

## Déroulement d'une partie
1. **Distribution** : Chaque joueur reçoit 2 cartes face cachée
2. **Small et Big Blind** : Mises obligatoires placées par les deux joueurs à gauche du donneur
3. **Premier tour d'enchères** : En commençant par le joueur à gauche de la big blind
4. **Le Flop** : 3 cartes communes sont révélées, suivi d'un tour d'enchères
5. **Le Tournant** : 4e carte commune révélée, suivi d'un tour d'enchères
6. **La Rivière** : 5e et dernière carte commune révélée, suivi d'un tour d'enchères
7. **L'Abattage** : Les joueurs restants révèlent leurs cartes, la meilleure main gagne

## Actions possibles pendant les enchères
- **Suivre (Call)** : Miser autant que la mise précédente
- **Relancer (Raise)** : Augmenter la mise précédente
- **Se coucher (Fold)** : Abandonner la main en cours
- **Checker** : Passer son tour sans miser (uniquement si aucune mise n'a été faite)`
  },
  {
    title: 'Blanc-Manger Coco',
    description: 'Un jeu d\'humour noir où vous complétez des phrases absurdes',
    longDescription: `Blanc-Manger Coco est un jeu de cartes humoristique inspiré du célèbre "Cards Against Humanity". Chaque tour, un joueur lit une carte question comportant une phrase à trous. Les autres joueurs doivent compléter cette phrase avec leurs cartes réponses pour créer la combinaison la plus drôle possible.

Le jeu se caractérise par son humour décalé, parfois noir, et ses situations absurdes. C'est un excellent jeu pour animer vos soirées entre adultes!`,
    howToPlay: `1. Chaque joueur reçoit 7 cartes réponses
2. À chaque tour, un joueur est désigné comme le "lecteur" et pioche une carte question
3. Tous les autres joueurs choisissent parmi leurs cartes réponses celle qui complète le mieux (ou de la façon la plus drôle) la phrase de la carte question
4. Les réponses sont mélangées puis lues à haute voix par le lecteur
5. Le lecteur choisit sa réponse préférée, et le joueur qui l'a proposée gagne la manche
6. Le rôle de lecteur passe au joueur suivant`,
    type: 'single-device',
    minPlayers: 3,
    maxPlayers: 12,
    duration: 30,
    thumbnail: 'https://example.com/images/blanc-manger-coco.jpg',
    difficulty: 1,
    categories: ['Humour', 'Cartes', 'Party game'],
    popularity: 4.7
  },
  // Ajout de nouveaux jeux
  {
    title: 'Time\'s Up',
    description: 'Faites deviner des célébrités à votre équipe en trois manches de plus en plus difficiles',
    longDescription: `Time's Up est un jeu de devinettes en équipe qui se joue en trois manches. Dans chaque manche, un joueur doit faire deviner à son équipe le nom d'une célébrité inscrite sur une carte, mais avec des contraintes croissantes.

Lors de la première manche, le joueur peut utiliser tous les mots qu'il souhaite (sauf le nom à deviner). Dans la deuxième manche, il ne peut dire qu'un seul mot. Et dans la troisième manche, il doit faire deviner uniquement par mime !`,
    howToPlay: `1. Formez deux équipes et choisissez 40 cartes de célébrités
2. Première manche : Chaque joueur a 30 secondes pour faire deviner autant de célébrités que possible à son équipe en utilisant des mots (sauf le nom à deviner)
3. Deuxième manche : Même chose, mais avec un seul mot par célébrité
4. Troisième manche : Même chose, mais uniquement par mime
5. L'équipe qui a deviné le plus de célébrités au total gagne`,
    type: 'single-device',
    minPlayers: 4,
    maxPlayers: 12,
    duration: 45,
    thumbnail: 'https://example.com/images/times-up.jpg',
    difficulty: 2,
    categories: ['Mime', 'Équipe', 'Party game'],
    popularity: 4.6
  },
  {
    title: 'Codenames',
    description: 'Faites deviner des mots à votre équipe à l\'aide d\'indices astucieux',
    longDescription: `Codenames est un jeu d'association d'idées où deux équipes s'affrontent. Des cartes comportant des mots sont disposées sur la table, et chaque équipe doit retrouver les mots qui lui sont assignés, guidée par les indices donnés par leur maître-espion.

Le maître-espion doit être stratégique en donnant des indices qui permettent à son équipe de deviner plusieurs mots à la fois, tout en évitant que l'équipe adverse ne devine les siens, et surtout en évitant l'assassin qui fait perdre immédiatement la partie.`,
    howToPlay: `1. Formez deux équipes (rouge et bleue) et désignez un maître-espion par équipe
2. Disposez 25 cartes-mots sur la table
3. Les maîtres-espions voient une grille qui indique quelles cartes appartiennent à chaque équipe
4. À tour de rôle, le maître-espion donne un indice composé d'un mot et d'un nombre (indiquant combien de mots sont liés à cet indice)
5. Son équipe tente alors de deviner les mots, un par un
6. Premier à trouver tous ses mots gagne, mais toucher l'assassin fait perdre immédiatement`,
    type: 'single-device',
    minPlayers: 4,
    maxPlayers: 8,
    duration: 15,
    thumbnail: 'https://example.com/images/codenames.jpg',
    difficulty: 2,
    categories: ['Mots', 'Équipe', 'Déduction'],
    popularity: 4.9
  }
];

// Données des utilisateurs
const usersData = [
  {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'alice',
    email: 'alice@example.com',
    password: 'alice123',
    role: 'user'
  },
  {
    username: 'bob',
    email: 'bob@example.com',
    password: 'bob123',
    role: 'user'
  },
  {
    username: 'charlie',
    email: 'charlie@example.com',
    password: 'charlie123',
    role: 'user'
  },
  {
    username: 'diana',
    email: 'diana@example.com',
    password: 'diana123',
    role: 'user'
  }
];

// Fonction pour initialiser la base de données
async function seedDatabase() {
  try {
    // Vérifier si on doit réinitialiser la base ou juste ajouter des données
    const shouldReset = process.argv.includes('--reset') || process.argv.includes('-r');
    
    if (shouldReset) {
      console.log('Réinitialisation complète de la base de données...');
      await Game.deleteMany({});
      await User.deleteMany({});
      await Room.deleteMany({});
    } else {
      console.log('Mode ajout: les données existantes seront conservées');
    }
    
    // Créer les utilisateurs
    const createdUsers = [];
    
    for (const userData of usersData) {
      // Vérifier si l'utilisateur existe déjà
      const existingUser = await User.findOne({ email: userData.email });
      
      if (existingUser) {
        console.log(`L'utilisateur ${userData.username} existe déjà`);
        createdUsers.push(existingUser);
      } else {
        const newUser = await User.create(userData);
        console.log(`Utilisateur ${userData.username} créé avec succès`);
        createdUsers.push(newUser);
      }
    }
    
    // Récupérer l'admin
    const admin = createdUsers.find(user => user.role === 'admin');
    
    // Ajouter/mettre à jour les jeux
    const createdGames = [];
    
    for (const gameData of gamesData) {
      // Vérifier si le jeu existe déjà
      const existingGame = await Game.findOne({ title: gameData.title });
      
      if (existingGame) {
        console.log(`Le jeu ${gameData.title} existe déjà, mise à jour...`);
        const updatedGame = await Game.findByIdAndUpdate(
          existingGame._id,
          {
            ...gameData,
            createdBy: existingGame.createdBy || admin._id
          },
          { new: true }
        );
        createdGames.push(updatedGame);
      } else {
        const newGame = await Game.create({
          ...gameData,
          createdBy: admin._id
        });
        console.log(`Jeu ${gameData.title} ajouté avec succès`);
        createdGames.push(newGame);
      }
    }
    
    // Créer quelques salles de jeu de démonstration
    const roomsData = [
      {
        game: createdGames.find(game => game.title === 'Loup-Garou')._id,
        host: createdUsers.find(user => user.username === 'alice')._id,
        maxPlayers: 10,
        isPrivate: false,
        players: [
          {
            userId: createdUsers.find(user => user.username === 'alice')._id,
            username: 'alice',
            isReady: true
          },
          {
            userId: createdUsers.find(user => user.username === 'bob')._id,
            username: 'bob',
            isReady: true
          },
          {
            userId: createdUsers.find(user => user.username === 'charlie')._id,
            username: 'charlie',
            isReady: false
          }
        ]
      },
      {
        game: createdGames.find(game => game.title === 'Codenames')._id,
        host: createdUsers.find(user => user.username === 'bob')._id,
        maxPlayers: 8,
        isPrivate: true,
        players: [
          {
            userId: createdUsers.find(user => user.username === 'bob')._id,
            username: 'bob',
            isReady: true
          },
          {
            userId: createdUsers.find(user => user.username === 'diana')._id,
            username: 'diana',
            isReady: true
          }
        ]
      }
    ];
    
    // Ne créer des salles que si on réinitialise la base
    if (shouldReset) {
      for (const roomData of roomsData) {
        const room = await Room.create(roomData);
        console.log(`Salle de jeu créée avec succès: ${room.code}`);
      }
    }
    
    // Ajouter des jeux aux favoris de certains utilisateurs
    const alice = createdUsers.find(user => user.username === 'alice');
    const bob = createdUsers.find(user => user.username === 'bob');
    
    if (alice && !alice.favorites.length) {
      alice.favorites = [
        createdGames.find(game => game.title === 'Loup-Garou')._id,
        createdGames.find(game => game.title === 'Blanc-Manger Coco')._id
      ];
      await alice.save();
      console.log('Favoris ajoutés pour Alice');
    }
    
    if (bob && !bob.favorites.length) {
      bob.favorites = [
        createdGames.find(game => game.title === 'Codenames')._id,
        createdGames.find(game => game.title === 'Time\'s Up')._id
      ];
      await bob.save();
      console.log('Favoris ajoutés pour Bob');
    }
    
    console.log('Base de données initialisée avec succès');
    console.log(`${createdUsers.length} utilisateurs, ${createdGames.length} jeux`);
    console.log('Pour vous connecter en tant qu\'admin: email: admin@example.com, mot de passe: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

// Vérifier les arguments pour afficher l'aide
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
Usage: node seedDatabase.js [options]

Options:
  --reset, -r     Réinitialiser complètement la base de données (supprime toutes les données existantes)
  --help, -h      Afficher cette aide

Sans option, le script ajoutera les données manquantes sans supprimer les données existantes.
  `);
  process.exit(0);
}

// Exécuter la fonction d'initialisation
seedDatabase();