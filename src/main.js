import './index.css'
import 'primeicons/primeicons.css'
import 'vue-toastification/dist/index.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import Toast from 'vue-toastification'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia().use(createPersistedState())

app.use(pinia)
app.use(router)

const toastOptions = {
    transition: 'Vue-Toastification__bounce',
    maxToasts: 10,
    newestOnTop: true,
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
    rtl: false
}

app.use(Toast, toastOptions)

app.mount('#app')
