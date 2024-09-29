<script setup>
import { onMounted, reactive } from 'vue';
import ContentWrapper from './ContentWrapper.vue';
import ContentLoader from './ContentLoader.vue';
import ProductCard from './ProductCard.vue';
import api from '@/services/api';

const props = defineProps({
    product: Object
})

const state = reactive({
    product: null,
    isLoading: true
})

const get = async () => {
    try {
        const response = await api.get(`/product?category_id=${ props.product.category_id }&remark=${ props.product.remark }&related_id=${ props.product.id }&limit=4`)
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
        <h1 class="text-3xl font-bold text-slate-900">Related Products</h1>
        
        <ContentLoader v-if="state.isLoading" />

        <template v-else>
            <div v-if="state.product.length === 0" class="text-2xl font-bold text-slate-600 text-center mt-24">Oops, Nothing To Show...</div>
            <div v-else class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                <ProductCard v-for="product in state.product" :key="product.id" :product="product" />
            </div>
        </template>
    </ContentWrapper>
</template>