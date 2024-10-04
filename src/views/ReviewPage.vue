<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import ReviewModal from '@/components/ReviewModal.vue';
import api from '@/services/api';
import { onMounted, provide, reactive, ref } from 'vue';

const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

const reviews = ref([])
const toReview = ref([])
const review = reactive({
    product: null,
    content: {
        review: null,
        rating: null,
        product_id: null
    },
    sale_price: null
})

const getReviews = async () => {
    try {
        const response = await api.get('/user/review')

        reviews.value = response.data.data
    } catch (error) {
        console.error(error)
    }
}

const getProductsToReview = async () => {
    try {
        const response = await api.get('/user/to-review')

        toReview.value = response.data.data
    } catch (error) {
        console.error(error)
    }
}

const openReview = (item) => {
    review.product = { ...item.product, id: item.product_id }
    review.content.review = item.review
    review.content.rating = item.rating
    review.content.product_id = item.product_id
    review.sale_price = item.sale_price || null
}

const getDate = (dt) => {
    const date = new Date(dt)

    return `${ date.getDate() } ${ date.toLocaleString('default', { month: 'short' }) } ${ date.getFullYear() } `
}

const getReviewData = async () => {
    pageIsLoading.value = true

    await getReviews()
    await getProductsToReview()

    pageIsLoading.value = false
}

onMounted( async () => {
    await getReviewData()

    plainBG.value = false
})
</script>

<template>
    <PageLoader :plainBG="plainBG" />
    <ContentWrapper :sectionClass="['px-0']">
        <h2 class="text-2xl font-bold text-slate-600 text-center">Reviews</h2>

        <ContentWrapper v-if="reviews.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </ContentWrapper>

        <template v-else>
            <div class="my-8 overflow-x-auto">
                <div class="min-w-[600px] py-3 px-4 md:px-6 lg:px-8 bg-slate-200 grid grid-cols-7 gap-2 sm:gap-6 text-center">
                    <div class="col-span-2">Product</div>
                    <div class="col-span-2">Review</div>
                    <div>Rating</div>
                    <div>Date</div>
                    <div>Action</div>
                </div>

                <div v-for="(reviewItem, index) in reviews" :key="index" class="min-w-[600px] py-4 px-4 md:px-6 lg:px-8 text-center border-b border-b-slate-200 grid grid-cols-7 gap-2 sm:gap-6 hover:bg-slate-50 transition-all">
                    <div class="col-span-2 text-left hover:text-rose-600 cursor-pointer"><router-link :to="{ name: 'product', params: { id: reviewItem.product.id } }">{{ reviewItem.product.title.slice(0, 30) }}</router-link></div>
                    <div class="col-span-2 text-left">{{ reviewItem.review }}</div>
                    <div>{{ reviewItem.rating }}</div>
                    <div>{{ getDate(reviewItem.updated_at) }}</div>
                    <div>
                        <button @click="openReview(reviewItem)" class="inline-block mx-2 py-1 px-3 rounded border border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
            
        </template>
        
        <h2 class="text-2xl font-bold text-slate-600 text-center">Reviews</h2>
        
        <ContentWrapper v-if="toReview.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </ContentWrapper>
        
        <template v-else>
            <div class="my-8 overflow-x-auto">
                <div class="min-w-[600px] py-3 px-4 md:px-6 lg:px-8 bg-slate-200 grid grid-cols-6 gap-2 sm:gap-6 text-center">
                    <div class="col-span-3">Product</div>
                    <div>Price</div>
                    <div>Date</div>
                    <div>Action</div>
                </div>

                <div v-for="(item, index) in toReview" :key="index" class="min-w-[600px] py-4 px-4 md:px-6 lg:px-8 text-center border-b border-b-slate-200 grid grid-cols-6 gap-2 sm:gap-6 hover:bg-slate-50 transition-all">
                    <div class="col-span-3 text-left hover:text-rose-600 cursor-pointer"><router-link :to="{ name: 'product', params: { id: item.product_id } }">{{ item.product.title }}</router-link></div>
                    <div>{{ item.sale_price }}</div>
                    <div>{{ getDate(item.updated_at) }}</div>
                    <div>
                        <button @click="openReview(item)" class="inline-block mx-2 py-1 px-3 rounded border border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                            Review
                        </button>
                    </div>
                </div>
            </div>

        </template>

        <ReviewModal @getReviewData="getReviewData" :review="review" />
    </ContentWrapper>
</template>