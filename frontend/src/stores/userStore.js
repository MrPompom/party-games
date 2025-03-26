import { defineStore } from 'pinia';
import api from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin'
  },
  
  actions: {
    async login(credentials) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/auth/login', credentials);
        
        this.user = response.data.user;
        this.token = response.data.token;
        
        // Stocker le token dans le localStorage
        localStorage.setItem('token', this.token);
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la connexion';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async register(userData) {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.post('/auth/register', userData);
        
        this.user = response.data.user;
        this.token = response.data.token;
        
        // Stocker le token dans le localStorage
        localStorage.setItem('token', this.token);
        
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de l\'inscription';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchCurrentUser() {
      if (!this.token) return null;
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.get('/auth/profile');
        this.user = response.data.user;
        return this.user;
      } catch (error) {
        // Si le token est invalide, déconnecter l'utilisateur
        if (error.response?.status === 401) {
          this.logout();
        }
        
        this.error = error.response?.data?.message || 'Erreur lors de la récupération du profil';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateProfile(userData) {
      if (!this.token) throw new Error('Utilisateur non connecté');
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.put('/auth/profile', userData);
        this.user = response.data.user;
        return this.user;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors de la mise à jour du profil';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async changePassword(passwordData) {
      if (!this.token) throw new Error('Utilisateur non connecté');
      
      this.loading = true;
      this.error = null;
      
      try {
        const response = await api.put('/auth/change-password', passwordData);
        return response.data;
      } catch (error) {
        this.error = error.response?.data?.message || 'Erreur lors du changement de mot de passe';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getFavorites() {
      if (!this.token) return [];
      
      this.loading = true;
      
      try {
        const response = await api.get('/users/favorites');
        return response.data.favorites;
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
        return [];
      } finally {
        this.loading = false;
      }
    },
    
    async addToFavorites(gameId) {
      if (!this.token) throw new Error('Utilisateur non connecté');
      
      try {
        const response = await api.post(`/games/${gameId}/favorite`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors de l\'ajout aux favoris:', error);
        throw error;
      }
    },
    
    async removeFromFavorites(gameId) {
      if (!this.token) throw new Error('Utilisateur non connecté');
      
      try {
        const response = await api.delete(`/games/${gameId}/favorite`);
        return response.data;
      } catch (error) {
        console.error('Erreur lors du retrait des favoris:', error);
        throw error;
      }
    },
    
    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('token');
    }
  }
});