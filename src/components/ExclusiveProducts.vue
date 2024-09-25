<script setup>
import axios from 'axios';
import { computed, onMounted, reactive, watch } from 'vue';
import ProductCard from './ProductCard.vue';
import ContentLoader from './ContentLoader.vue';
import ContentWrapper from './ContentWrapper.vue';


const remarks = reactive({
    'Popular': { products: [], isLoading: true, selected: true },
    'New': { products: [], isLoading: true, selected: false },
    'Hot': { products: [], isLoading: true, selected: false },
    'Discount': { products: [], isLoading: true, selected: false },
    'Flash Sale': { products: [], isLoading: true, selected: false },
    'Trending': { products: [], isLoading: true, selected: false }
})
const selected = reactive({
    value: null,
    isLoading: true
})

onMounted(() => {
    selected.value = "Popular"
    selected.isLoading = false
})

const products = computed(() => selected.isLoading ? [] : remarks[selected.value].products)

const setRemark = (remark) => {
    remarks[selected.value].selected = false
    selected.value = remark
}

watch(selected, async () => {
    if (remarks[selected.value].isLoading) {
        try {
            const response = await axios.get(`http://localhost:8000/api/remark/${ encodeURI( selected.value.toLowerCase() ) }/products`)
            remarks[selected.value].products = response.data.data
        } catch (error) {
            console.error(error);
        } finally {
            remarks[selected.value].isLoading = false
        }
    }
    remarks[selected.value].selected = true
})
</script>

<template>
    <ContentWrapper>
        <div class="text-center">
            <h1 class="text-3xl font-bold text-slate-900">Exclusive Products</h1>
            <div class="my-6 md:mt-16 flex flex-wrap justify-center">
                <span @click="setRemark(remark)" v-for="(remark, index) in Object.keys(remarks)" :key="index" class="hover:text-rose-600 cursor-pointer mx-1 px-4 py-1 font-semibold" :class="remarks[remark].selected ? 'text-rose-600' : ''">{{ remark }}</span>
            </div>
        </div>

        <ContentLoader v-if="selected.isLoading || remarks[selected.value].isLoading" :loaderClass="'my-[25vh]'" />

        <div class="grid md:grid-cols-4 grid-cols-2 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>
        <h2 class="text-2xl font-bold text-slate-600 text-center my-24" v-if="!selected.isLoading && !remarks[selected.value].isLoading && products.length === 0">Oops, Nothing To Show...</h2>
    </ContentWrapper>
</template>

<style scoped>
.product-title-short:hover + .product-title-full {
    display: block;
}
</style>