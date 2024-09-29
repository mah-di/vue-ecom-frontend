import PolicyPage from '@/views/PolicyPage.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ListingPage from '@/views/ListingPage.vue'
import ProductPage from '@/views/ProductPage.vue'
import SearchPage from '@/views/SearchPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import VerificationPage from '@/views/VerificationPage.vue'
import ProfilePage from '@/views/ProfilePage.vue'
import useAuthStore from '@/stores/authStore'

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
    {
      path: '/:type/:identifier',
      name: 'listing',
      component: ListingPage
    },
    {
      path: '/search',
      name: 'search',
      component: SearchPage,
      beforeEnter(to, from, next) {
        if (to.query.q)
          return next()

        return next({ name: 'home' })
      }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()

        return authStore.isAuthenticated ? next({ name: 'home' }) : next()
      }
    },
    {
      path: '/verify',
      name: 'verify',
      component: VerificationPage,
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()

        if (authStore.isAuthenticated)
          return next({ name: 'home' })

        if (!authStore.isAuthenticated && !authStore.state.email)
          return next({ name: 'login' })
        
        return next()
      }
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0, left: 0 }
  }
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth)
    return authStore.isAuthenticated ? next() : next({ name: 'login' })
  
  return next()
})

export default router
