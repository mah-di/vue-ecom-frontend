<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import { onMounted, provide, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

const orderId = ref(route.params.id)
const state = reactive({
    order: null,
    orderItems: []
})

const review = reactive({
    item: null,
    content: {
        review: null,
        rating: null,
        product_id: null
    }
})

const getOrder = async () => {
    try {
        const response = await api.get(`/invoice/${ orderId.value }`)

        state.order = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        plainBG.value = false
    }
}

const getOrderDetail = async () => {
    try {
        const response = await api.get(`/invoice-detail/${ orderId.value }`)

        state.orderItems.push(...response.data.data)
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const getDate = (dt) => {
    const date = new Date(dt)

    return `${ date.getDate() } ${ date.toLocaleString('default', { month: 'short' }) } ${ date.getFullYear() } `
}

const openReview = async (item) => {
    pageIsLoading.value = true
    
    try {
        const response = await api.get(`/user/review/${ item.product_id }`)
        
        if (response.data.data) {
            review.content.review = response.data.data.review
            review.content.rating = response.data.data.rating
        }

        review.item = item
        review.content.product_id = item.product_id
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const submitReview = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.post(`/user/review`, review.content)

        if (response.data.status === "success")
            closeReview()

    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const closeReview = () => {
    review.item = null
    review.content.review = null
    review.content.rating = null
    review.content.product_id = null
}

onMounted( async () => {
    await getOrder()
    await getOrderDetail()
})
</script>

<template>
    <PageLoader :plainBG="plainBG" />

    <ContentWrapper :sectionClass="['px-0']">
        <template v-if="!state.order && state.orderItems.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </template>

        <template v-else>
            <h2 class="text-2xl font-bold text-slate-600 text-center">Order Items</h2>

            <div class="my-8 overflow-x-auto">
                <div class="min-w-[600px] py-3 px-4 md:px-6 lg:px-8 bg-slate-200 grid grid-cols-4 sm:grid-cols-6 gap-2 sm:gap-6 text-center">
                    <div class="col-span-1 sm:col-span-3">Product</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Action</div>
                </div>

                <div v-for="(item, index) in state.orderItems" :key="index" class="min-w-[600px] py-4 px-4 md:px-6 lg:px-8 text-center border-b border-b-slate-200 grid grid-cols-6 gap-2 sm:gap-6 hover:bg-slate-50 transition-all">
                    <div class="text-start col-span-3"><router-link :to="{ name: 'product', params: { id: item.product.id } }" class="cursor-pointer hover:text-rose-600 transition-all">{{ item.product.title }}</router-link></div>
                    <div>৳ {{ item.sale_price }}</div>
                    <div>{{ item.qty }}</div>
                    <div>
                        <button @click="openReview(item)" class="inline-block mx-2 py-1 px-3 rounded border border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            Review
                        </button>
                        <router-link :to="{ name: 'product', params: { id: item.product.id } }" class="inline-block m-2 py-1 px-3 rounded border border-rose-600 bg-rose-600 text-white hover:bg-rose-700 transition-all">
                            Buy Again
                        </router-link>
                    </div>
                </div>
            </div>

            <h2 class=" mt-24 text-2xl font-bold text-slate-600 text-center">Order Details</h2>

            <div class="my-8 py-4 px-4 md:px-6 lg:px-8 bg-slate-50">
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Date:</div>
                    <div class="font-semibold">{{ getDate(state.order.created_at) }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Order ID:</div>
                    <div class="font-semibold">{{ state.order.id }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Transaction ID:</div>
                    <div class="font-semibold">{{ state.order.transaction_id }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Payment Status:</div>
                    <div class="font-semibold">{{ state.order.payment_status }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Delivery Status:</div>
                    <div class="font-semibold">{{ state.order.delivery_status }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Sub Total:</div>
                    <div class="font-semibold">৳ {{ state.order.total }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Vat (5%):</div>
                    <div class="font-semibold">৳ {{ state.order.vat }}</div>
                </div>
                <div class="grid grid-cols-2 py-2">
                    <div class="text-slate-600">Grand Total:</div>
                    <div class="font-semibold">৳ {{ state.order.payable }}</div>
                </div>
            </div>

            <div v-if="review.item" @click.self="closeReview" class="fixed top-0 left-0 z-50 bg-slate-900 opacity-[99.5%] w-full h-full flex items-center justify-center">
                <div class="bg-slate-50 py-12 w-[90vw] sm:w-[70vw] lg:w-[50vw] rounded-lg">
                    <div class="flex gap-6 px-4 md:px-6 lg:px-8">
                        <div>
                            <router-link :to="{ name: 'product', params: { id: review.item.product_id } }">
                                <img :src="review.item.product.image" :alt="review.item.product.title" class="sm:h-40 min-[480px]:h-20 h-12 object-cover">
                            </router-link>
                        </div>
    
                        <div>
                            <router-link :to="{ name: 'product', params: { id: review.item.product_id } }">
                                <h3 class="text-lg font-bold text-slate-800 hover:text-rose-600 cursor-pointer">{{ review.item.product.title }}</h3>
                            </router-link>
                            <p class="text-slate-500 mt-2">Buying Price : ৳ {{ review.item.sale_price }}</p>
                        </div>
                    </div>

                    <div class="my-6 px-4 md:px-6 lg:px-8">
                        <span class="text-sm font-bold">Review</span>
                        <textarea v-model="review.content.review" rows="4" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all"></textarea>
                    </div>

                    <div class="my-6 px-4 md:px-6 lg:px-8">
                        <span class="text-sm font-bold">Rating</span>
                        <select v-model="review.content.rating" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
                            <option selected value>Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>

                    <div class="my-6 px-4 md:px-6 lg:px-8">
                        <button @click="submitReview(review.item.id)" class="inline-block mx-2 py-1 px-3 rounded border border-rose-600 bg-rose-600 text-white hover:bg-rose-700 transition-all">
                            Submit
                        </button>
                        <button @click="closeReview" class="inline-block m-2 py-1 px-3 rounded border border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </template>
    </ContentWrapper>
</template>