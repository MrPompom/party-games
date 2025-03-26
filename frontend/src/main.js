import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Importation des styles globaux (si nécessaire)
import './assets/css/style.css'

// Création de l'application
const app = createApp(App)

// Utilisation des plugins
app.use(createPinia())
app.use(router)

// Montage de l'application
app.mount('#app')