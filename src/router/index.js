import { createRouter, createWebHistory } from 'vue-router'
import useAuthStore from '@/stores/authStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/:policy',
      name: 'policy',
      component: () => import('@/views/PolicyPage.vue')
    },
    {
      path: '/:type/:identifier',
      name: 'listing',
      component: () => import('@/views/ListingPage.vue')
    },
    {
      path: '/search',
      name: 'search',
      component: () => import('@/views/SearchPage.vue'),
      beforeEnter(to, from, next) {
        if (to.query.q)
          return next()

        return next({ name: 'home' })
      }
    },
    {
      path: '/product/:id',
      name: 'product',
      component: () => import('@/views/ProductPage.vue')
    },
    {
      path: '/profile',
      component: () => import('@/views/ProfilePage.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'detail',
          name: 'account',
          component: () => import('@/views/AccountPage.vue')
        },
        {
          path: 'order',
          name: 'order',
          component: () => import('@/views/OrderPage.vue')
        },
        {
          path: 'order/:id',
          name: 'singleOrder',
          component: () => import('@/views/SingleOrderPage.vue')
        },
        {
          path: 'cart',
          name: 'cart',
          component: () => import('@/views/CartPage.vue')
        },
        {
          path: 'wishlist',
          name: 'wishlist',
          component: () => import('@/views/WishlistPage.vue')
        },
        {
          path: 'review',
          name: 'review',
          component: () => import('@/views/ReviewPage.vue')
        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginPage.vue'),
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()

        return authStore.isAuthenticated ? next({ name: 'home' }) : next()
      }
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('@/views/VerificationPage.vue'),
      beforeEnter(to, from, next) {
        const authStore = useAuthStore()

        if (authStore.isAuthenticated)
          return next({ name: 'home' })

        if (!authStore.isAuthenticated && !authStore.state.email)
          return next({ name: 'login' })
        
        return next()
      }
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404',
      component: () => import('@/views/NotFoundPage.vue')
    }
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
