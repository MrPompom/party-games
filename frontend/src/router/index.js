import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/games',
    name: 'GameCatalog',
    component: () => import('@/views/GameCatalog.vue')
  },
  {
    path: '/games/:id',
    name: 'GameDetail',
    component: () => import('@/views/GameDetail.vue'),
    props: true
  },
  {
    path: '/rules/:id',
    name: 'RulesGame',
    component: () => import('@/views/RulesGame.vue'),
    props: true
  },
  {
    path: '/play/single-device/:id',
    name: 'SingleDeviceGame',
    component: () => import('@/views/SingleDeviceGame.vue'),
    props: true
  },
  {
    path: '/lobby',
    name: 'MultiplayerLobby',
    component: () => import('@/views/MultiplayerLobby.vue')
  },
  {
    path: '/play/multiplayer/:id',
    name: 'MultiplayerGame',
    component: () => import('@/views/MultiplayerGame.vue'),
    props: true
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// Navigation guards can be added here
router.beforeEach((to, from, next) => {
  // Check if the route requires authentication
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isAuthenticated = localStorage.getItem('token') // Simplistic auth check

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else {
    next()
  }
})

export default router