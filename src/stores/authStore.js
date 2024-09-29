import api from "@/services/api"
import { defineStore } from "pinia"
import { computed, reactive } from "vue"
import { useRouter } from "vue-router"

const useAuthStore = defineStore('auth', () => {
    const router = useRouter()

    const state = reactive({
        id: null,
        name: null,
        email: null,
        otp: null,
        authToken: null
    })

    const isAuthenticated = computed(() => !!state.authToken)

    const requestOTP = async () => {
        try {
            const response = await api.post('/login', { email: state.email })
            router.push({ name: 'verify' })
            return response.data
        } catch (error) {
            console.error(error)
            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }

    const verifyOTP = async () => {
        try {
            const response = await api.post('/login-verify', { email: state.email, otp: state.otp })

            if (response.data.status === "success") {
                const data = response.data.data

                state.id = data.user.id
                state.email = data.user.email
                state.otp = null
                state.authToken = data.token

                const res = await getProfile()

                res ? router.push({ name: 'home' }) : router.push({ name: 'profile' })
            }

            return response.data
        } catch (error) {
            console.error(error)
            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }

    const getProfile = async () => {
        try {
            const response = await api.get(`/profile`, { headers: { token: state.authToken } })

            if (!response.data.data) 
                return false
                
            state.name = response.data.data.cus_name

            return true
        } catch (error) {
            console.error(error)
        }
    }

    const logout = () => {
        Object.keys(state).forEach(key => state[key] = null)

        router.push({ name: 'login' })
    }

    return { state, isAuthenticated, requestOTP, verifyOTP, logout }

}, { persist: true })

export default useAuthStore