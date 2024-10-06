<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import useAuthStore from '@/stores/authStore';
import { onMounted, provide, ref } from 'vue';
import { useToast } from 'vue-toastification';

const wishlist = ref([])
const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

const authStore = useAuthStore()
const toast = useToast()

const get = async () => {
    pageIsLoading.value = true
    try {
        const response = await api.get('/user/wish')

        if (response.data.status === 'error')
            return toast.error("Unexpected error occurred, please try again")

        wishlist.value = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
        plainBG.value = false
    }
}

onMounted( async () => await get())

const remove = async id => {
    pageIsLoading.value = true

    const data = await authStore.removeFromWishlist(id)

    data.status === "success"
        ? toast.success(data.message)
        : toast.error(data.message)

    await get()

    pageIsLoading.value = false
}

const clearWishlist = async () => {
    pageIsLoading.value = true

    const data = await authStore.clearWishlist()

    data.status === "success"
        ? toast.success(data.message)
        : toast.error(data.message)

    await get()

    pageIsLoading.value = false
}
</script>

<template>
    <PageLoader :plainBG="plainBG" />
    <ContentWrapper>
        <h2 class="text-2xl font-bold text-slate-600 text-center">Wishlist</h2>

        <ContentWrapper v-if="wishlist.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </ContentWrapper>

        <template v-else>
            <div class="my-8">
                <div class="text-end pb-4">
                    <button @click="clearWishlist" class="text-rose-600 border border-rose-600 px-8 py-2 rounded font-semibold hover:text-white hover:bg-rose-600 transition-all"><i class="pi pi-trash"></i> Clear Wishlist</button>
                </div>
                <div v-for="(wish, index) in wishlist" :key="index" class="py-6 -mt-[1px] border-t border-b border-t-slate-200 border-b-slate-200 grid grid-cols-6 gap-2 sm:gap-6">
                    <div>
                        <router-link :to="{ name: 'product', params: { id: wish.product.id } }">
                            <img :src="wish.product.image" :alt="wish.product.title" class="w-20 sm:h-20 min-[480px]:h-12 h-8 object-cover">
                        </router-link>
                    </div>
    
                    <div class="col-span-4">
                        <router-link :to="{ name: 'product', params: { id: wish.product.id } }">
                            <h3 class="text-lg font-bold text-slate-800 hover:text-rose-600 cursor-pointer">{{ wish.product.title }}</h3>
                        </router-link>
                        <p class="text-slate-500 mt-2">Price: ৳ {{ wish.product.price }}</p>
                    </div>
    
                    <div class="text-end">
                        <i @click="remove(wish.product.id)" class="pi pi-trash text-xl text-rose-600 hover:text-rose-700 cursor-pointer transition-all"></i>
                    </div>
                </div>
            </div>
        </template>
    </ContentWrapper>
</template>