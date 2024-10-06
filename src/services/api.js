import axios from "axios"
import useAuthStore from "@/stores/authStore"
import { useToast } from "vue-toastification"

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
    if (response.data.status === "fail")
        response.data = { ...response.data, status: "error" }

    return response
}, (error) => {
    if (error.response && error.response.status === 401) {
        const toast = useToast()
        toast.error('Session expired. Please login again.')

        const authStore = useAuthStore()
        authStore.logout()
    }

    return Promise.reject(error)
})

export default api