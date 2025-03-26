import axios from 'axios'

// Créer une instance d'axios avec une configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 secondes
})

// Intercepteur de requêtes
api.interceptors.request.use(
  (config) => {
    // Ajouter le token d'authentification si disponible
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur de réponses
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Gérer les erreurs spécifiques (401, 403, etc.)
    if (error.response) {
      // Si le token est invalide ou expiré
      if (error.response.status === 401) {
        localStorage.removeItem('token')
        // Redirection vers la page de connexion si nécessaire
        // window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api