import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../modules/quality/views/QualityDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../modules/auth/views/Login.vue')
  },
  {
    path: '/quality',
    name: 'QualityManagement',
    component: () => import('../modules/quality/views/QualityDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quality/documents',
    name: 'Documents',
    component: () => import('../modules/quality/views/DocumentList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quality/processes',
    name: 'Processes',
    component: () => import('../modules/quality/views/ProcessList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quality/audits',
    name: 'Audits',
    component: () => import('../modules/quality/views/AuditList.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/quality/non-conformities',
    name: 'NonConformities',
    component: () => import('../modules/quality/views/NonConformityList.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router