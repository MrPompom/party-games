<template>
    <div class="register-page bg-gray-100 min-h-screen flex items-center justify-center py-12 px-4">
      <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-6">Créer un compte</h1>
          <p class="text-gray-600 mb-4">Inscrivez-vous pour accéder à tous nos jeux</p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="username" class="sr-only">Nom d'utilisateur</label>
              <input 
                id="username" 
                name="username" 
                type="text" 
                v-model="username"
                autocomplete="username" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Nom d'utilisateur" 
              />
            </div>
            <div>
              <label for="email" class="sr-only">Email</label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                v-model="email"
                autocomplete="email" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
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
                autocomplete="new-password" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Mot de passe" 
              />
            </div>
            <div>
              <label for="confirmPassword" class="sr-only">Confirmer le mot de passe</label>
              <input 
                id="confirmPassword" 
                name="confirmPassword" 
                type="password" 
                v-model="confirmPassword"
                autocomplete="new-password" 
                required 
                class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" 
                placeholder="Confirmer le mot de passe" 
              />
            </div>
          </div>
  
          <div class="flex items-center">
            <input 
              id="terms" 
              name="terms" 
              type="checkbox" 
              v-model="acceptTerms"
              required
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
            />
            <label for="terms" class="ml-2 block text-sm text-gray-900">
              J'accepte les <a href="#" class="text-indigo-600 hover:text-indigo-500">conditions d'utilisation</a>
            </label>
          </div>
  
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isLoading || !passwordsMatch"
            >
              <span v-if="isLoading">Inscription en cours...</span>
              <span v-else>S'inscrire</span>
            </button>
          </div>
          
          <div v-if="!passwordsMatch && password && confirmPassword" class="text-red-500 text-sm text-center">
            Les mots de passe ne correspondent pas
          </div>
        </form>
  
        <div class="text-center mt-4">
          <p class="text-sm text-gray-600">
            Vous avez déjà un compte ?
            <router-link to="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
              Connectez-vous
            </router-link>
          </p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'RegisterPage',
    setup() {
      const router = useRouter();
      const username = ref('');
      const email = ref('');
      const password = ref('');
      const confirmPassword = ref('');
      const acceptTerms = ref(false);
      const isLoading = ref(false);
      const error = ref('');
  
      const passwordsMatch = computed(() => {
        return !password.value || !confirmPassword.value || password.value === confirmPassword.value;
      });
  
      const handleRegister = async () => {
        if (!passwordsMatch.value) {
          return;
        }
  
        isLoading.value = true;
        error.value = '';
        
        try {
          // Simuler un appel API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Rediriger vers la page de connexion
          router.push('/login');
        } catch (err) {
          error.value = "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
        } finally {
          isLoading.value = false;
        }
      };
  
      return {
        username,
        email,
        password,
        confirmPassword,
        acceptTerms,
        isLoading,
        error,
        passwordsMatch,
        handleRegister
      };
    }
  };
  </script>