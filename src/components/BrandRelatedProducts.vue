<script setup>
import { onMounted, reactive } from 'vue';
import ContentWrapper from './ContentWrapper.vue';
import ContentLoader from './ContentLoader.vue';
import ProductCard from './ProductCard.vue';
import api from '@/services/api';

const props = defineProps({
    brand: Object,
    productId: Number
})

const state = reactive({
    product: null,
    isLoading: true
})

const get = async () => {
    try {
        const response = await api.get(`/product?brand_id=${ props.brand.id }&related_id=${ props.productId }&limit=3`)
        state.product = response.data.data.data
    } catch (error) {
        console.error(error)
    } finally {
        state.isLoading = false
    }
}

onMounted( async () => await get())
</script>

<template>
    <ContentWrapper>
        <h1 class="text-3xl font-bold text-slate-900">More Products From {{ brand.name }}</h1>
        
        <ContentLoader v-if="state.isLoading" />

        <template v-else>
            <div v-if="state.product.length === 0" class="text-2xl font-bold text-slate-600 text-center mt-24">Oops, Nothing To Show...</div>
            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <ProductCard v-for="product in state.product" :key="product.id" :product="product" />
                <router-link :to="{ name: 'listing', params: { type: 'brand', identifier: brand.id } }" class="block w-full h-full text-center shadow shadow-slate-200 bg-slate-50 text-rose-600 hover:bg-slate-100 hover:text-rose-700 hover:scale-105 transition-all">
                    <span class="flex h-full w-full justify-center items-center text-lg font-semibold">View More</span>
                </router-link>
            </div>
        </template>
    </ContentWrapper>
</template>