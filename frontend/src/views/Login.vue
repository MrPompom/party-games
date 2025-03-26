<template>
    <div class="login-page bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Connexion</h1>
          <p class="text-gray-600 mb-4">Entrez vos identifiants pour accéder à votre compte</p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="email" class="sr-only">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                v-model="email"
                autocomplete="email" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Adresse email" 
              />
            </div>
            <div>
              <label for="password" class="sr-only">Mot de passe</label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                v-model="password"
                autocomplete="current-password" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Mot de passe" 
              />
            </div>
          </div>
  
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember-me" 
                name="remember-me" 
                type="checkbox" 
                v-model="rememberMe"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>
  
            <div class="text-sm">
              <a href="#" class="font-medium text-indigo-600 hover:text-indigo-500">
                Mot de passe oublié ?
              </a>
            </div>
          </div>
  
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isLoading"
            >
              <span v-if="isLoading">Connexion en cours...</span>
              <span v-else>Se connecter</span>
            </button>
          </div>
        </form>
  
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Vous n'avez pas de compte ?
            <router-link to="/register" class="font-medium text-indigo-600 hover:text-indigo-500">
              Inscrivez-vous
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'LoginPage',
    setup() {
      const router = useRouter();
      const email = ref('');
      const password = ref('');
      const rememberMe = ref(false);
      const isLoading = ref(false);
      const error = ref('');
  
      const handleLogin = async () => {
        isLoading.value = true;
        error.value = '';
        
        try {
          // Simuler un appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Stocker le token (à remplacer par un appel API réel)
          localStorage.setItem('token', 'dummy-token');
          
          // Rediriger vers la page d'accueil ou la page demandée
          const redirectPath = router.currentRoute.value.query.redirect || '/';
          router.push(redirectPath);
        } catch (err) {
          error.value = 'Identifiants incorrects. Veuillez réessayer.';
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        email,
        password,
        rememberMe,
        isLoading,
        error,
        handleLogin
      };
    }
  };
  </script>