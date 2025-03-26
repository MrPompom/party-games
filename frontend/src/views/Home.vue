<template>
    <div class="home">
      <!-- Section Hero -->
      <section class="hero bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12 md:py-24">
        <div class="container mx-auto px-4">
          <div class="flex flex-col items-center text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-4">Vos soirées jeux réinventées</h1>
            <p class="text-xl md:text-2xl mb-8 max-w-3xl">
              Découvrez, jouez et partagez des jeux de société et party games, 
              seul ou à plusieurs, sur un même appareil ou en ligne !
            </p>
            <div class="flex flex-col sm:flex-row gap-4">
              <Button 
                label="Découvrir les jeux" 
                type="primary" 
                :to="{ name: 'GameCatalog' }" 
                icon="search"
              />
              <Button 
                label="Jouer maintenant" 
                type="secondary" 
                :to="{ name: 'MultiplayerLobby' }" 
                icon="play"
              />
            </div>
          </div>
        </div>
      </section>
  
      <!-- Section Catégories de jeux -->
      <section class="game-categories py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Tous les types de jeux réunis</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Catégorie 1: Règles de jeux -->
            <Card class="flex flex-col items-center text-center p-6">
              <template #icon>
                <div class="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                  <i class="fas fa-book text-blue-600 text-3xl"></i>
                </div>
              </template>
              <template #title>
                <h3 class="text-xl font-bold mb-2">Règles de jeux</h3>
              </template>
              <template #content>
                <p class="text-gray-600 mb-4">
                  Une bibliothèque complète de règles pour vos jeux de cartes et de société favoris, 
                  toujours à portée de main.
                </p>
                <Button 
                  label="Voir les règles" 
                  type="outline" 
                  size="small"
                  :to="{ name: 'GameCatalog', query: { type: 'rules' } }" 
                />
              </template>
            </Card>
  
            <!-- Catégorie 2: Jeux sur un seul appareil -->
            <Card class="flex flex-col items-center text-center p-6">
              <template #icon>
                <div class="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <i class="fas fa-mobile-alt text-green-600 text-3xl"></i>
                </div>
              </template>
              <template #title>
                <h3 class="text-xl font-bold mb-2">Jeux sur un appareil</h3>
              </template>
              <template #content>
                <p class="text-gray-600 mb-4">
                  Des jeux interactifs conçus pour être joués à plusieurs sur un seul téléphone ou tablette, 
                  parfaits pour animer vos soirées.
                </p>
                <Button 
                  label="Jouer ensemble" 
                  type="outline" 
                  size="small"
                  :to="{ name: 'GameCatalog', query: { type: 'single-device' } }" 
                />
              </template>
            </Card>
  
            <!-- Catégorie 3: Jeux multijoueurs -->
            <Card class="flex flex-col items-center text-center p-6">
              <template #icon>
                <div class="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                  <i class="fas fa-users text-purple-600 text-3xl"></i>
                </div>
              </template>
              <template #title>
                <h3 class="text-xl font-bold mb-2">Jeux multijoueurs</h3>
              </template>
              <template #content>
                <p class="text-gray-600 mb-4">
                  Connectez-vous en ligne avec vos amis et jouez à des jeux multijoueurs comme Loup-Garou, 
                  chacun depuis son propre appareil.
                </p>
                <Button 
                  label="Jouer en ligne" 
                  type="outline" 
                  size="small"
                  :to="{ name: 'GameCatalog', query: { type: 'multiplayer' } }" 
                />
              </template>
            </Card>
          </div>
        </div>
      </section>
  
      <!-- Section Comment ça marche -->
      <section class="how-it-works py-16">
        <div class="container mx-auto px-4">
          <h2 class="text-3xl font-bold text-center mb-12">Comment ça marche ?</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold">1</div>
              <h3 class="text-xl font-bold mb-2">Choisissez votre jeu</h3>
              <p class="text-gray-600">
                Parcourez notre catalogue et sélectionnez le jeu qui vous intéresse parmi les différentes catégories.
              </p>
            </div>
            
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold">2</div>
              <h3 class="text-xl font-bold mb-2">Invitez vos amis</h3>
              <p class="text-gray-600">
                Pour les jeux multijoueurs, créez une salle et partagez le code d'invitation avec vos amis.
              </p>
            </div>
            
            <div class="flex flex-col items-center text-center">
              <div class="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mb-4 text-xl font-bold">3</div>
              <h3 class="text-xl font-bold mb-2">Jouez et amusez-vous</h3>
              <p class="text-gray-600">
                Suivez les instructions à l'écran et profitez d'une expérience de jeu fluide et interactive.
              </p>
            </div>
          </div>
        </div>
      </section>
  
      <!-- Section Jeux populaires -->
      <section class="popular-games py-16 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h2 class="text-3xl font-bold">Jeux populaires</h2>
            <Button 
              label="Voir tous les jeux" 
              type="text" 
              :to="{ name: 'GameCatalog' }" 
              icon="arrow-right"
            />
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Les cartes de jeux seront chargées dynamiquement -->
            <GameCard 
              v-for="game in popularGames" 
              :key="game.id" 
              :game="game" 
              @click="navigateToGame(game.id)"
            />
          </div>
        </div>
      </section>
  
      <!-- Section CTA -->
      <section class="cta py-16 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-3xl font-bold mb-4">Prêt à commencer la partie ?</h2>
          <p class="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de joueurs et accédez à tous nos jeux gratuitement.
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              label="S'inscrire" 
              type="white" 
              :to="{ name: 'Register' }"
            />
            <Button 
              label="Se connecter" 
              type="outline-white" 
              :to="{ name: 'Login' }"
            />
          </div>
        </div>
      </section>
    </div>
  </template>
  
  <script>
  import Button from '@/components/ui/Button.vue';
  import Card from '@/components/ui/Card.vue';
  import GameCard from '@/components/games/GameCard.vue';
  import { useGameStore } from '@/stores/gameStore';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'HomePage',
    components: {
      Button,
      Card,
      GameCard
    },
    setup() {
      const gameStore = useGameStore();
      const router = useRouter();
  
      // Populer les jeux à l'initialisation
      gameStore.fetchPopularGames();
      
      const navigateToGame = (gameId) => {
        router.push({ name: 'GameDetail', params: { id: gameId } });
      };
  
      return {
        popularGames: gameStore.popularGames,
        navigateToGame
      };
    }
  };
  </script>