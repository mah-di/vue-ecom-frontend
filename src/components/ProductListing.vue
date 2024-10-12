<script setup>
import axios from 'axios';
import { inject, onMounted, reactive, ref, watch } from 'vue';
import ContentWrapper from './ContentWrapper.vue';
import ProductCard from './ProductCard.vue';
import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router';
import ContentLoader from './ContentLoader.vue';
import SelectOption from './SelectOption.vue';
import useCategoryStore from '@/stores/categoryStore';
import useBrandStore from '@/stores/brandStore';

const route = useRoute()
const router = useRouter()

const pageIsLoading = inject('pageIsLoading')
const props = defineProps({
    type: {
        type: String,
        default: null
    },
    identifier: {
        type: String,
        default: null
    }
})

const categoryStore = useCategoryStore()
const brandStore = useBrandStore()

const options = {
    remarks : [
        {name: 'Popular', id: 'Popular'},
        {name: 'New', id: 'New'},
        {name: 'Hot', id: 'Hot'},
        {name: 'Discount', id: 'Discount'},
        {name: 'Flash Sale', id: 'Flash Sale'},
        {name: 'Trending', id: 'Trending'}
    ],
    price: [
        {name: 5000, id: 5000},
        {name: 10000, id: 10000},
        {name: 20000, id: 20000},
        {name: 30000, id: 30000},
        {name: 50000, id: 50000},
        {name: 75000, id: 75000},
        {name: 100000, id: 100000},
        {name: 150000, id: 150000},
        {name: 200000, id: 200000},
        {name: 300000, id: 300000},
        {name: 500000, id: 500000},
        {name: 750000, id: 750000},
        {name: 1000000, id: 1000000},
    ],
    rating: [
        {name: 1, id: 1},
        {name: 2, id: 2},
        {name: 3, id: 3},
        {name: 4, id: 4},
        {name: 5, id: 5}
    ]
}

const products = ref([])
const isLoading = ref(true)
const openFilter = ref(false)

const endpoint = ref(`${ import.meta.env.VITE_API_ENDPOINT }/product`)

const filters = reactive({
    q: route.query.q || null,
    category_id: route.query.category_id || null,
    brand_id: route.query.brand_id || null,
    remark: route.query.remark || null,
    min_price: route.query.min_price || null,
    max_price: route.query.max_price || null,
    min_rating: route.query.min_rating || null,
    max_rating: route.query.max_rating || null,
    stock: route.query.stock || null
})

const get = async () => {
    try {
        const response = await axios.get(endpoint.value, { params: filters })
        products.value.push(...response.data.data.data)
        endpoint.value = response.data.data.next_page_url
    } catch (error) {
        console.error(error)
        endpoint.value = null
    } finally {
        pageIsLoading.value = false
        isLoading.value = false
    }
}

const applyFilter = async () => {
    var query = {};

    Object.keys(filters).forEach(key => filters[key] && (query[key] = filters[key]))

    router.push({ query: query })
}

onMounted( async () => {
    const query = props.type === 'remark' ? props.type : `${ props.type }_id`
    filters[query] = props.identifier

    await get()
})

onBeforeRouteUpdate( async (to, from, next) => {
    products.value = []
    pageIsLoading.value = true
    isLoading.value = true
    openFilter.value = false

    Object.keys(filters).forEach(key => filters[key] = to.query[key] || null)

    const query = to.params.type === 'remark' ? to.params.type : `${ to.params.type }_id`
    filters[query] = to.params.identifier
    endpoint.value = `${ import.meta.env.VITE_API_ENDPOINT }/product`

    return next()
})

watch(() => route.fullPath, async () => await get())
</script>

<template>
    <ContentWrapper>
        <div class="my-8">
            <div class="flex justify-between">
                <h1 class="text-3xl font-bold text-slate-900">Filter Products</h1>
                <button @click="openFilter = !openFilter" class="block py-2 px-6 text-center rounded border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all"><i class="pi pi-filter"></i></button>
            </div>
            <div v-if="openFilter" class="p-4 mt-6 shadow-md shadow-slate-500">
                <div class="grid md:grid-cols-3 grid-cols-1 gap-0 md:gap-6">
                    <div class="flex flex-col justify-evenly h-[150px] py-4 border-b border-b-slate-200 md:py-0">
                        <SelectOption v-if="type !== 'brand'" v-model="filters.brand_id" :defaultValue="'Filter By Brand'" :options="brandStore.brands" />
                        <SelectOption v-if="type !== 'category'" v-model="filters.category_id" :defaultValue="'Filter By Category'" :options="categoryStore.categories" />
                        <SelectOption v-if="type !== 'remark'" v-model="filters.remark" :defaultValue="'Filter By Remark'" :options="options.remarks" />
                    </div>
                    <div class="flex flex-col justify-evenly h-[150px] py-4 border-b border-b-slate-200 md:py-0">
                        <SelectOption v-model="filters.min_price" :defaultValue="'Minimum Price'" :options="options.price" />
                        <SelectOption v-model="filters.max_price" :defaultValue="'Maximum Price'" :options="options.price" />
                    </div>
                    <div class="flex flex-col justify-evenly h-[150px] py-4 border-b border-b-slate-200 md:py-0">
                        <SelectOption v-model="filters.min_rating" :defaultValue="'Minimum Rating'" :options="options.rating" />
                        <SelectOption v-model="filters.max_rating" :defaultValue="'Maximum Rating'" :options="options.rating" />
                    </div>
                    <div>
                        <div class="py-4">
                            <span class="mr-2">Stock :</span>
                            <input type="radio" v-model="filters.stock" name="stock" value="in">
                            <label class="ml-1 mr-2">In</label>
                            <input type="radio" v-model="filters.stock" name="stock" value="out">
                            <label class="ml-1">Out</label>
                        </div>
                    </div>
                </div>
                <button @click="applyFilter" class="block w-full py-3 rounded border bg-blue-600 hover:bg-blue-700 text-white mt-6 font-bold transition-all">Apply Filter</button>
            </div>
        </div>

        <div class="grid md:grid-cols-4 grid-cols-2 gap-6">
            <ProductCard v-for="product in products" :key="product.id" :product="product" />
        </div>

        <ContentLoader v-if="isLoading" />

        <h2 class="text-2xl font-bold text-slate-600 text-center my-24" v-if="!pageIsLoading && products.length === 0">Oops, Nothing To Show...</h2>

        <div class="my-8">
            <button class="block w-full py-3 text-center rounded border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all" v-if="!isLoading && !pageIsLoading && endpoint" @click="isLoading = true; get()">Load More</button>
        </div>
    </ContentWrapper>
</template>