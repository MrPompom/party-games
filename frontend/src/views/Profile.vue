<template>
    <div class="profile-page">
      <!-- En-tête -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold mb-2">Mon profil</h1>
          <p class="text-lg">Gérez vos informations personnelles et vos préférences</p>
        </div>
      </div>
  
      <!-- Contenu principal -->
      <div class="container mx-auto px-4 py-8">
        <!-- Chargement -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
  
        <!-- Contenu -->
        <div v-else-if="user" class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Colonne gauche: Infos profil -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-lg shadow-md p-6 mb-6">
              <div class="flex items-center mb-6">
                <div
                  class="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold mr-4"
                >
                  {{ userInitials }}
                </div>
                <div>
                  <h2 class="text-2xl font-bold">{{ user.username }}</h2>
                  <p class="text-gray-600">{{ user.email }}</p>
                  <p v-if="user.role === 'admin'" class="mt-1 inline-block bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                    Administrateur
                  </p>
                </div>
              </div>
  
              <div class="border-t border-gray-200 pt-4">
                <p class="text-gray-600 text-sm mb-1">Membre depuis</p>
                <p class="font-medium">{{ formatDate(user.createdAt) }}</p>
              </div>
  
              <div class="border-t border-gray-200 pt-4 mt-4">
                <p class="text-gray-600 text-sm mb-1">Dernière connexion</p>
                <p class="font-medium">{{ formatDate(user.lastLogin) }}</p>
              </div>
            </div>
  
            <!-- Actions -->
            <div class="bg-white rounded-lg shadow-md p-6">
              <h3 class="text-lg font-bold mb-4">Actions</h3>
              <div class="space-y-3">
                <button
                  @click="activeTab = 'profile'"
                  class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
                  :class="{ 'bg-indigo-50 text-indigo-700': activeTab === 'profile' }"
                >
                  <i class="fas fa-user mr-2"></i> Modifier mon profil
                </button>
                <button
                  @click="activeTab = 'password'"
                  class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
                  :class="{ 'bg-indigo-50 text-indigo-700': activeTab === 'password' }"
                >
                  <i class="fas fa-key mr-2"></i> Changer de mot de passe
                </button>
                <button
                  @click="activeTab = 'favorites'"
                  class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
                  :class="{ 'bg-indigo-50 text-indigo-700': activeTab === 'favorites' }"
                >
                  <i class="fas fa-heart mr-2"></i> Mes jeux favoris
                </button>
                <button
                  @click="activeTab = 'history'"
                  class="w-full text-left px-4 py-2 rounded hover:bg-gray-100 transition"
                  :class="{ 'bg-indigo-50 text-indigo-700': activeTab === 'history' }"
                >
                  <i class="fas fa-history mr-2"></i> Historique des parties
                </button>
                <button
                  @click="logout"
                  class="w-full text-left px-4 py-2 text-red-600 rounded hover:bg-red-50 transition"
                >
                  <i class="fas fa-sign-out-alt mr-2"></i> Se déconnecter
                </button>
              </div>
            </div>
          </div>
  
          <!-- Colonne droite: Contenu variable -->
          <div class="lg:col-span-2">
            <!-- Modification du profil -->
            <div v-if="activeTab === 'profile'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-bold mb-6">Modifier mon profil</h2>
              <form @submit.prevent="updateProfile">
                <div class="mb-4">
                  <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
                    Nom d'utilisateur
                  </label>
                  <input
                    type="text"
                    id="username"
                    v-model="profileForm.username"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
  
                <div class="mb-4">
                  <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    id="email"
                    v-model="profileForm.email"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
  
                <div class="mb-6">
                  <label for="avatar" class="block text-sm font-medium text-gray-700 mb-1">
                    Avatar URL (optionnel)
                  </label>
                  <input
                    type="text"
                    id="avatar"
                    v-model="profileForm.avatar"
                    placeholder="https://example.com/avatar.jpg"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
  
                <div v-if="profileError" class="bg-red-50 text-red-600 p-4 rounded mb-4">
                  {{ profileError }}
                </div>
  
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :disabled="profileLoading"
                  >
                    <span v-if="profileLoading">Enregistrement...</span>
                    <span v-else>Enregistrer les modifications</span>
                  </button>
                </div>
              </form>
            </div>
  
            <!-- Changement de mot de passe -->
            <div v-if="activeTab === 'password'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-bold mb-6">Changer de mot de passe</h2>
              <form @submit.prevent="changePassword">
                <div class="mb-4">
                  <label for="currentPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe actuel
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    v-model="passwordForm.currentPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                </div>
  
                <div class="mb-4">
                  <label for="newPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    v-model="passwordForm.newPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    minlength="6"
                  />
                </div>
  
                <div class="mb-6">
                  <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    v-model="passwordForm.confirmPassword"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  <p v-if="!passwordsMatch && passwordForm.confirmPassword" class="mt-1 text-sm text-red-600">
                    Les mots de passe ne correspondent pas
                  </p>
                </div>
  
                <div v-if="passwordError" class="bg-red-50 text-red-600 p-4 rounded mb-4">
                  {{ passwordError }}
                </div>
  
                <div v-if="passwordSuccess" class="bg-green-50 text-green-600 p-4 rounded mb-4">
                  {{ passwordSuccess }}
                </div>
  
                <div class="flex justify-end">
                  <button
                    type="submit"
                    class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :disabled="passwordLoading || !passwordsMatch"
                  >
                    <span v-if="passwordLoading">Modification...</span>
                    <span v-else>Modifier le mot de passe</span>
                  </button>
                </div>
              </form>
            </div>
  
            <!-- Jeux favoris -->
            <div v-if="activeTab === 'favorites'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-bold mb-6">Mes jeux favoris</h2>
              
              <div v-if="loadingFavorites" class="py-8 text-center">
                <div class="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p class="text-gray-600">Chargement de vos jeux favoris...</p>
              </div>
              
              <div v-else-if="favorites.length === 0" class="py-8 text-center">
                <div class="text-gray-400 text-5xl mb-4">
                  <i class="fas fa-heart-broken"></i>
                </div>
                <p class="text-gray-600 mb-4">Vous n'avez pas encore de jeux favoris</p>
                <router-link 
                  to="/games" 
                  class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Parcourir les jeux
                </router-link>
              </div>
              
              <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div 
                  v-for="game in favorites" 
                  :key="game.id" 
                  class="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  <div class="flex">
                    <img 
                      :src="game.thumbnail || '/images/placeholder-game.jpg'" 
                      :alt="game.title"
                      class="w-24 h-24 object-cover"
                    />
                    <div class="p-3 flex-1">
                      <h3 class="font-bold text-lg mb-1">{{ game.title }}</h3>
                      <div class="flex justify-between items-center">
                        <p class="text-sm text-gray-600">{{ typeLabels[game.type] }}</p>
                        <div class="flex items-center gap-2">
                          <button 
                            @click="removeFromFavorites(game.id)"
                            class="text-red-500 hover:text-red-700 transition text-sm"
                            title="Retirer des favoris"
                          >
                            <i class="fas fa-heart-broken"></i>
                          </button>
                          <router-link 
                            :to="`/games/${game.id}`"
                            class="text-indigo-500 hover:text-indigo-700 transition text-sm"
                            title="Voir le jeu"
                          >
                            <i class="fas fa-eye"></i>
                          </router-link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Historique des parties -->
            <div v-if="activeTab === 'history'" class="bg-white rounded-lg shadow-md p-6">
              <h2 class="text-xl font-bold mb-6">Historique des parties</h2>
              
              <div v-if="loadingHistory" class="py-8 text-center">
                <div class="animate-spin inline-block rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                <p class="text-gray-600">Chargement de votre historique...</p>
              </div>
              
              <div v-else-if="gameHistory.length === 0" class="py-8 text-center">
                <div class="text-gray-400 text-5xl mb-4">
                  <i class="fas fa-dice"></i>
                </div>
                <p class="text-gray-600 mb-4">Vous n'avez pas encore joué de partie</p>
                <router-link 
                  to="/games" 
                  class="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Parcourir les jeux
                </router-link>
              </div>
              
              <div v-else class="space-y-4">
                <div 
                  v-for="(game, index) in gameHistory" 
                  :key="index" 
                  class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <h3 class="font-bold text-lg">{{ game.title }}</h3>
                      <p class="text-sm text-gray-600">{{ formatDateTime(game.date) }}</p>
                    </div>
                    <div class="bg-gray-100 px-2 py-1 rounded text-sm">
                      {{ game.result }}
                    </div>
                  </div>
                  <div class="mt-2 text-sm">
                    <span class="text-gray-600 mr-2">Joueurs:</span>
                    <span>{{ game.players.join(', ') }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Utilisateur non connecté -->
        <div v-else class="text-center py-12">
          <div class="text-gray-400 text-5xl mb-4">
            <i class="fas fa-user-slash"></i>
          </div>
          <h2 class="text-2xl font-bold mb-4">Vous n'êtes pas connecté</h2>
          <p class="text-gray-600 mb-6">Connectez-vous pour accéder à votre profil</p>
          <div class="flex justify-center gap-4">
            <router-link 
              to="/login" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Se connecter
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 border border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50"
            >
              S'inscrire
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed, onMounted, reactive } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/stores/userStore';
  import { useGameStore } from '@/stores/gameStore';
  import { format } from 'date-fns';
  import { fr } from 'date-fns/locale';
  
  export default {
    name: 'ProfilePage',
    setup() {
      const router = useRouter();
      const userStore = useUserStore();
      const gameStore = useGameStore();
      
      // État général
      const loading = ref(true);
      const activeTab = ref('profile');
      
      // États spécifiques
      const profileForm = reactive({
        username: '',
        email: '',
        avatar: ''
      });
      const profileLoading = ref(false);
      const profileError = ref('');
      
      const passwordForm = reactive({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      const passwordLoading = ref(false);
      const passwordError = ref('');
      const passwordSuccess = ref('');
      
      // Favoris et historique
      const favorites = ref([]);
      const loadingFavorites = ref(false);
      const gameHistory = ref([]);
      const loadingHistory = ref(false);
      
      // Étiquettes pour les types de jeu
      const typeLabels = {
        'rules': 'Règles de jeu',
        'single-device': 'Jeu sur un appareil',
        'multiplayer': 'Jeu multijoueur'
      };
      
      // Utilisateur actuel
      const user = computed(() => userStore.user);
      
      // Initiales de l'utilisateur pour l'avatar
      const userInitials = computed(() => {
        if (!user.value) return '';
        
        const username = user.value.username || '';
        return username.substring(0, 2).toUpperCase();
      });
      
      // Vérifier si les mots de passe correspondent
      const passwordsMatch = computed(() => {
        return passwordForm.newPassword === passwordForm.confirmPassword;
      });
      
      // Chargement initial
      onMounted(async () => {
        try {
          await userStore.fetchCurrentUser();
          
          // Si l'utilisateur est connecté, initialiser le formulaire
          if (userStore.user) {
            profileForm.username = userStore.user.username || '';
            profileForm.email = userStore.user.email || '';
            profileForm.avatar = userStore.user.avatar || '';
            
            // Charger les favoris
            await loadFavorites();
            
            // Simuler l'historique (à remplacer par un appel API)
            await loadGameHistory();
          }
        } catch (error) {
          console.error('Erreur de chargement du profil:', error);
        } finally {
          loading.value = false;
        }
      });
      
      // Mettre à jour le profil
      const updateProfile = async () => {
        profileLoading.value = true;
        profileError.value = '';
        
        try {
          await userStore.updateProfile({
            username: profileForm.username,
            email: profileForm.email,
            avatar: profileForm.avatar
          });
          
          alert('Profil mis à jour avec succès');
        } catch (error) {
          console.error('Erreur de mise à jour du profil:', error);
          profileError.value = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
        } finally {
          profileLoading.value = false;
        }
      };
      
      // Changer le mot de passe
      const changePassword = async () => {
        if (!passwordsMatch.value) {
          passwordError.value = 'Les mots de passe ne correspondent pas';
          return;
        }
        
        passwordLoading.value = true;
        passwordError.value = '';
        passwordSuccess.value = '';
        
        try {
          await userStore.changePassword({
            currentPassword: passwordForm.currentPassword,
            newPassword: passwordForm.newPassword
          });
          
          passwordSuccess.value = 'Mot de passe modifié avec succès';
          passwordForm.currentPassword = '';
          passwordForm.newPassword = '';
          passwordForm.confirmPassword = '';
        } catch (error) {
          console.error('Erreur de changement de mot de passe:', error);
          passwordError.value = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
        } finally {
          passwordLoading.value = false;
        }
      };
      
      // Charger les jeux favoris
      const loadFavorites = async () => {
        if (!userStore.user) return;
        
        loadingFavorites.value = true;
        
        try {
          // Simuler un appel API (à remplacer par un vrai appel)
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Dans un cas réel, on récupérerait les favoris depuis l'API
          // Pour la démo, on utilise des données fictives
          favorites.value = [
            {
              id: '1',
              title: 'Loup-Garou',
              type: 'multiplayer',
              thumbnail: '/images/games/werewolf.jpg'
            },
            {
              id: '4',
              title: 'Blanc-Manger Coco',
              type: 'single-device',
              thumbnail: '/images/games/blanc-manger-coco.jpg'
            }
          ];
        } catch (error) {
          console.error('Erreur de chargement des favoris:', error);
        } finally {
          loadingFavorites.value = false;
        }
      };
      
      // Retirer un jeu des favoris
      const removeFromFavorites = async (gameId) => {
        try {
          // Simuler un appel API (à remplacer par un vrai appel)
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Retirer localement
          favorites.value = favorites.value.filter(game => game.id !== gameId);
          
          // Afficher un message de confirmation
          alert('Jeu retiré des favoris');
        } catch (error) {
          console.error('Erreur lors du retrait des favoris:', error);
        }
      };
      
      // Charger l'historique des parties
      const loadGameHistory = async () => {
        if (!userStore.user) return;
        
        loadingHistory.value = true;
        
        try {
          // Simuler un appel API (à remplacer par un vrai appel)
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Dans un cas réel, on récupérerait l'historique depuis l'API
          // Pour la démo, on utilise des données fictives
          gameHistory.value = [
            {
              title: 'Loup-Garou',
              date: new Date(2023, 2, 15, 20, 30),
              players: ['alice', 'bob', 'charlie', 'david', 'eve', 'frank', 'grace', 'heidi'],
              result: 'Victoire des Loups-Garous'
            },
            {
              title: 'Codenames',
              date: new Date(2023, 2, 10, 19, 0),
              players: ['alice', 'bob', 'charlie', 'david'],
              result: 'Victoire de l\'équipe rouge'
            },
            {
              title: 'Tu Te Mets Combien ?',
              date: new Date(2023, 1, 28, 21, 15),
              players: ['alice', 'eve', 'frank'],
              result: '1er - alice (42 pts)'
            }
          ];
        } catch (error) {
          console.error('Erreur de chargement de l\'historique:', error);
        } finally {
          loadingHistory.value = false;
        }
      };
      
      // Déconnexion
      const logout = () => {
        userStore.logout();
        router.push('/login');
      };
      
      // Formatage des dates
      const formatDate = (dateString) => {
        if (!dateString) return 'Jamais';
        
        const date = new Date(dateString);
        return format(date, 'PP', { locale: fr });
      };
      
      const formatDateTime = (date) => {
        return format(date, 'Pp', { locale: fr });
      };
      
      return {
        loading,
        user,
        userInitials,
        activeTab,
        profileForm,
        profileLoading,
        profileError,
        passwordForm,
        passwordLoading,
        passwordError,
        passwordSuccess,
        passwordsMatch,
        favorites,
        loadingFavorites,
        gameHistory,
        loadingHistory,
        typeLabels,
        updateProfile,
        changePassword,
        removeFromFavorites,
        logout,
        formatDate,
        formatDateTime
      };
    }
  };
  </script>