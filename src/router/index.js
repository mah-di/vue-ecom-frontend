import PolicyPage from '@/views/PolicyPage.vue'
import HomePage from '@/views/HomePage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import ListingPage from '@/views/ListingPage.vue'
import ProductPage from '@/views/ProductPage.vue'
import SearchPage from '@/views/SearchPage.vue'

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
      component: SearchPage
    },
    {
      path: '/product/:id',
      name: 'product',
      component: ProductPage
    },
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition ? savedPosition : { top: 0, left: 0 }
  }
})

export default router
