<template>
    <div class="not-found min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div class="text-center max-w-xl">
        <div class="text-6xl font-bold text-indigo-600 mb-6">404</div>
        <h1 class="text-3xl font-bold mb-4">Page introuvable</h1>
        <p class="text-gray-600 mb-8">
          Oups ! La page que vous recherchez semble avoir disparu dans la dimension des jeux perdus.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link 
            to="/" 
            class="px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition"
          >
            Retour à l'accueil
          </router-link>
          <router-link 
            to="/games" 
            class="px-6 py-3 bg-white border border-indigo-600 text-indigo-600 font-bold rounded-lg hover:bg-indigo-50 transition"
          >
            Voir les jeux
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'NotFoundPage'
  };
  </script>