<!-- src/components/layout/Navbar.vue -->
<template>
    <nav class="bg-white shadow-md">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- Logo et lien d'accueil -->
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <router-link to="/" class="flex items-center">
                <!-- Logo (remplacer par votre propre logo) -->
                <div class="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold mr-2">
                  JS
                </div>
                <span class="text-xl font-bold text-gray-800">Jeux de Soirée</span>
              </router-link>
            </div>
            
            <!-- Liens de navigation (version desktop) -->
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <router-link 
                v-for="item in navItems" 
                :key="item.path" 
                :to="item.path" 
                class="px-3 py-2 text-gray-600 hover:text-primary font-medium rounded-md"
                :class="{ 'text-primary': $route.path.includes(item.path) && item.path !== '/' }"
              >
                {{ item.name }}
              </router-link>
            </div>
          </div>
          
          <!-- Boutons d'action -->
          <div class="flex items-center">
            <!-- Bouton de connexion/profil (à remplacer par un avatar si connecté) -->
            <router-link 
              to="/profile" 
              class="ml-3 px-4 py-2 rounded-md text-gray-600 hover:text-primary font-medium"
            >
              Profil
            </router-link>
            
            <!-- Hamburger menu pour mobile -->
            <button 
              @click="toggleMobileMenu"
              class="sm:hidden ml-2 p-2 rounded-md text-gray-600 hover:text-primary"
            >
              <svg 
                class="h-6 w-6" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  v-if="!mobileMenuOpen" 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M4 6h16M4 12h16M4 18h16"
                />
                <path 
                  v-else 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Menu mobile -->
      <div v-if="mobileMenuOpen" class="sm:hidden">
        <div class="pt-2 pb-3 space-y-1">
          <router-link 
            v-for="item in navItems" 
            :key="item.path" 
            :to="item.path" 
            class="block px-3 py-2 text-base font-medium text-gray-600 hover:text-primary hover:bg-gray-50"
            :class="{ 'text-primary bg-gray-50': $route.path.includes(item.path) && item.path !== '/' }"
            @click="mobileMenuOpen = false"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const mobileMenuOpen = ref(false);
  
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const navItems = [
    { name: 'Accueil', path: '/' },
    { name: 'Jeux', path: '/games' },
    { name: 'Multijoueur', path: '/multiplayer' },
  ];
  </script>