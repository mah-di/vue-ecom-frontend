import api from "@/services/api"
import { defineStore } from "pinia"
import { ref } from "vue"

const useBrandStore = defineStore('brand', () => {
    const brands = ref([])
    const isLoading = ref(true)

    const get = async () => {
        if (brands.value.length === 0) {
            try {
                const response = await api.get('/brand')
                if (response.data.status === "success") {
                    brands.value.push(...response.data.data)
                }
            } catch (error) {
                console.error(error);
            } finally {
                isLoading.value = false
            }
        }
    }

    return { brands, isLoading, get }
})

export default useBrandStore