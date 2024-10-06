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
        authToken: null,
        wishlist: []
    })

    const isAuthenticated = computed(() => !!state.authToken)

    const requestOTP = async () => {
        try {
            const response = await api.post('/login', { email: state.email })

            if (response.data.status === "success")
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

                let hasProfile = null

                for (let i = 0; i < 5; i++) {
                    hasProfile = await getProfile()
                    if (hasProfile !== null) break
                }

                for (let i = 0; i < 5; i++)
                    if (await getWishlist()) break

                hasProfile ? router.push({ name: 'home' }) : router.push({ name: 'account' })
            }

            return response.data
        } catch (error) {
            console.error(error)
            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }

    const getProfile = async () => {
        try {
            const response = await api.get(`/profile`)

            if (response.data.status !== "success") 
                return null

            if (!response.data.data) 
                return false
                
            state.name = response.data.data.cus_name

            return true
        } catch (error) {
            console.error(error)

            return null
        }
    }

    const getWishlist = async () => {
        try {
            const response = await api.get(`/user/wish?short=true`)

            if (response.data.status !== "success")
                return false

            state.wishlist.push(...response.data.data)

            return true
        } catch (error) {
            console.error(error)

            return false
        }
    }

    const updateWishlist = async (id) => {
        if (isWishlisted(id))
            return await removeFromWishlist(id)

        return await addToWishlist(id)
    }

    const addToWishlist = async id => {
        try {
            const response = await api.get(`/user/wish/${ id }`)

            if (response.data.status === "success") 
                state.wishlist.push(id)

            return response.data
        } catch (error) {
            console.error(error)

            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }

    const removeFromWishlist = async id => {
        try {
            const response = await api.delete(`/user/wish/${ id }`)

            if (response.data.status === "success")
                state.wishlist = state.wishlist.filter(item => item !== id)

            return response.data
        } catch (error) {
            console.error(error)

            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }
    
    const clearWishlist = async () => {
        try {
            let response = await api.delete('/user/wish')

            if (response.data.status === "success")
                state.wishlist = []

            return response.data
        } catch (error) {
            console.error(error)

            return { status: 'error', message: 'Unexpected error occurred, please try again' }
        }
    }

    const isWishlisted = id => state.wishlist.includes(id)

    const logout = () => {
        Object.keys(state).forEach( key => state[key] = ( key === 'wishlist' ) ? [] : null )

        router.push({ name: 'login' })
    }

    return { state, isAuthenticated, requestOTP, verifyOTP, logout, updateWishlist, removeFromWishlist, clearWishlist, isWishlisted }

}, { persist: true })

export default useAuthStore