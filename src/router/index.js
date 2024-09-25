import PolicyPage from '@/views/PolicyPage.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/:policy',
      name: 'policy',
      component: PolicyPage
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition

    return { top: 0, left: 0 }
  }
})

export default router
