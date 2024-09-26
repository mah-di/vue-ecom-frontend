<script setup>
import axios from 'axios';
import { inject, onMounted, ref, watch } from 'vue';
import ContentWrapper from './ContentWrapper.vue';
import ProductCard from './ProductCard.vue';
import { onBeforeRouteUpdate } from 'vue-router';

const pageIsLoading = inject('pageIsLoading')
const props = defineProps({
    type: String,
    identifier: String
})
const products = ref([])

const get = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/${ props.type }/${ props.identifier }/products`)
        products.value = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

onMounted( async () => await get())

onBeforeRouteUpdate( async (to, from, next) => {
    products.value = []
    pageIsLoading.value = true
    return next()
})

watch(() => [props.type, props.identifier], async () => await get())
</script>

<template>
    <ContentWrapper>
        <div class="grid md:grid-cols-4 grid-cols-2 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
        <h2 class="text-2xl font-bold text-slate-600 text-center my-24" v-if="!pageIsLoading && products.length === 0">Oops, Nothing To Show...</h2>
    </ContentWrapper>
</template>