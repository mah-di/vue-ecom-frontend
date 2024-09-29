import axios from "axios"
import useAuthStore from "@/stores/authStore"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_ENDPOINT
})

api.interceptors.request.use(config => {
    const authStore = useAuthStore()

    if (authStore.isAuthenticated)
        config.headers.token = authStore.state.authToken

    return config
}, (error) => {
    return Promise.reject(error);
})

api.interceptors.response.use((response) => {
    return response
}, (error) => {
    if (error.response && error.response.status === 401) {
        const authStore = useAuthStore()
        authStore.logout()
    }

    return Promise.reject(error)
})

export default api