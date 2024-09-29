import api from "@/services/api"
import { defineStore } from "pinia"
import { ref } from "vue"

const useCategoryStore = defineStore('category', () => {
    const categories = ref([])
    const isLoading = ref(true)

    const get = async () => {
        if (categories.value.length === 0) {
            try {
                const response = await api.get('/category')
                if (response.data.status === "success") {
                    categories.value.push(...response.data.data)
                }
            } catch (error) {
                console.error(error);
            } finally {
                isLoading.value = false
            }
        }
    }

    return { categories, isLoading, get }
})

export default useCategoryStore