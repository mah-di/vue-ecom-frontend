<script setup>
import { computed, provide, reactive, ref } from 'vue';
import ContentWrapper from './ContentWrapper.vue';
import SelectOption from './SelectOption.vue';
import useAuthStore from '@/stores/authStore';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import PageLoader from './PageLoader.vue';

const router = useRouter()
const authStore = useAuthStore()

const props = defineProps({
    product: Object,
    productDetail: Object
})

const openImgViewer = ref(false)

const stock = ref(props.product.stock)

const cart = reactive({
    product_id: props.product.id,
    size: null,
    color: null,
    qty: 1
})

const pageIsLoading = ref(false)
provide('pageIsLoading', pageIsLoading)

const sizeOptions = computed(() => {
    if (!props.productDetail) 
        return []

    let options = []
    props.productDetail.size.split(',').forEach(size => {
        options.push({ name: size, id: size })
    })

    return options
})

const colorOptions = computed(() => {
    if (!props.productDetail) 
        return []

    let options = []
    props.productDetail.color.split(',').forEach(color => {
        options.push({ name: color, id: color })
    })

    return options
})

const images = computed(() => {
    const detailImages = !props.productDetail ? [] : [
        props.productDetail.img1,
        props.productDetail.img2,
        props.productDetail.img3,
        props.productDetail.img4
    ]

    return [
        props.product.image,
        ...detailImages
    ]
})

const activeImg = ref(images.value[0])

const updateWishlist = async (id) => {
    if (!authStore.isAuthenticated)
        return router.push({ name: 'login' })

    await authStore.updateWishlist(id)
}

const addToCart = async () => {
    if (!authStore.isAuthenticated)
        return router.push({ name: 'login' })

    if (props.productDetail && !cart.size)
        return alert('Please select size')

    if (props.productDetail && !cart.color)
        return alert('Please select color')

    pageIsLoading.value = true

    try {
        const response = await api.post('/user/cart', cart)

        if (response.data.status === "success")
            stock.value = response.data.data.remaining_stock
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}
</script>

<template>
    <PageLoader />
    <ContentWrapper>
        <div class="pb-12">
            <p class="text-slate-600 text-lg">
                <router-link :to="{ name: 'home' }" class="hover:text-rose-600 transition-all">Home</router-link>
                <i class="pi pi-angle-right mx-1"></i>
                <router-link :to="{ name: 'listing', params: { type: 'category', identifier: product.category.id }}" class="hover:text-rose-600 transition-all">{{ product.category.name }}</router-link>
                <i class="pi pi-angle-right mx-1"></i>
                <span class="text-rose-600">This Page</span>
            </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <div @click="openImgViewer = true" class="cursor-pointer bg-slate-50">
                    <img class="mx-auto max-w-full h-[50vw] md:h-[25vw] 2xl:h-[20vw] " :src="activeImg" alt="">
                </div>

                <div v-show="openImgViewer" @click.self="openImgViewer = false" class="fixed top-0 left-0 h-full w-full bg-black/85 z-50 px-[10vw] flex flex-col justify-center">
                    <img class="mx-auto max-w-full max-h-[90vh]" :src="activeImg" alt="">
                </div>

                <div class="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-t-slate-200">
                    <div v-for="image in images" @click="activeImg = image" :key="image" class="bg-slate-50 cursor-pointer">
                        <img class="mx-auto max-w-full h-full" :src="image" alt="">
                    </div>
                </div>
            </div>

            <div>
                <div class="pb-8">
                    <div class="flex justify-between">
                        <router-link :to="{ name: 'listing', params: { type: 'brand', identifier: product.brand.id }}" class="inline-block py-[1.5px] px-2 mb-2 text-sm rounded text-rose-600 hover:text-rose-700 bg-slate-50 hover:bg-slate-100 transition-all font-semibold">{{ product.brand.name }}</router-link>
                        <i @click="updateWishlist(product.id)" class="pi text-xl ml-4 text-rose-600 hover:pi-heart-fill cursor-pointer transition-all" :class="authStore.isWishlisted(product.id) ? 'pi-heart-fill' : 'pi-heart'"></i>
                    </div>
                    <h1 class="text-slate-900 text-2xl font-bold">{{ product.title }}</h1>
                    <p v-if="product.star" class="text-rose-600">Rating: <i class="pi pi-star"></i> {{ product.star }} / 5</p>
                    <p v-else class="text-slate-600">No Reviews Yet</p>
                    <p class="text-xl font-semibold text-rose-600 mt-4 pt-4 border-t border-t-slate-200">৳ {{ product.price }}</p>
                    <p class="mt-2 text-lg font-semibold">Stock Left: {{ stock }}</p>
                    <p class="mt-4 text-slate-600">{{ product.short_des }}</p>
                    <template v-if="productDetail">
                        <div class="mt-4">
                            <div class="py-2">
                                <p class="text-slate-900 font-semibold mb-1">Size</p>
                                <SelectOption v-model="cart.size" :defaultValue="'Select Size'" :options="sizeOptions" />
                            </div>
                            <div class="py-2">
                                <p class="text-slate-900 font-semibold mb-1">Color</p>
                                <SelectOption v-model="cart.color" :defaultValue="'Select Color'" :options="colorOptions" />
                            </div>
                        </div>
                    </template>
                </div>

                <div class="pt-8 flex flex-col lg:flex-row justify-between align-middle border-t border-t-slate-200">
                    <div class="text-center">
                        <button @click="cart.qty--" :disabled="cart.qty == 1" class="py-3 px-4 rounded-full border border-rose-600 hover:bg-rose-600 hover:text-white disabled:bg-slate-200 disabled:text-inherit transition-all"><i class="pi pi-minus"></i></button>
                        <span class="w-16 text-center py-2 px-8 border border-rose-600 focus:outline-none rounded mx-4">{{ cart.qty }}</span>
                        <button @click="cart.qty++" :disabled="cart.qty == product.stock" class="py-3 px-4 rounded-full border border-rose-600 hover:bg-rose-600 hover:text-white disabled:bg-slate-200 disabled:text-inherit transition-all"><i class="pi pi-plus"></i></button>
                    </div>

                    <div class="text-center mt-4 lg:mt-0">
                        <button @click="addToCart" class="inline bg-rose-600 text-white px-10 py-3 rounded font-semibold hover:bg-rose-700 transition-all"><i class="pi pi-shopping-cart mr-2"></i> Add To Cart</button>
                    </div>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>