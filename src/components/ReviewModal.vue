<script setup>
import api from '@/services/api';
import { inject } from 'vue';

const pageIsLoading = inject('pageIsLoading')

const props = defineProps({
    review: Object
})

const emit = defineEmits(['getReviewData'])

const submitReview = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.post(`/user/review`, props.review.content)

        if (response.data.status === "success") {
            emit('getReviewData')
            closeReview()
        }

    } catch (error) {
        console.error(error)
    }
}

const closeReview = () => {
    props.review.product = null
    props.review.content.review = null
    props.review.content.rating = null
    props.review.content.product_id = null
    props.review.sale_price = null
}
</script>

<template>
    <div v-if="review.product" @click.self="closeReview" class="fixed top-0 left-0 z-50 bg-slate-900 opacity-[99.5%] w-full h-full flex items-center justify-center">
        <div class="bg-slate-50 py-12 w-[90vw] sm:w-[70vw] lg:w-[50vw] rounded-lg">
            <div class="flex gap-6 px-4 md:px-6 lg:px-8">
                <div>
                    <router-link :to="{ name: 'product', params: { id: review.product.id } }">
                        <img :src="review.product.image" :alt="review.product.title" class="sm:h-40 min-[480px]:h-20 h-12 object-cover">
                    </router-link>
                </div>

                <div>
                    <router-link :to="{ name: 'product', params: { id: review.product.id } }">
                        <h3 class="text-lg font-bold text-slate-800 hover:text-rose-600 cursor-pointer">{{ review.product.title }}</h3>
                    </router-link>
                    <p v-if="review.sale_price" class="text-slate-500 mt-2">Buying Price : ৳ {{ review.sale_price }}</p>
                </div>
            </div>

            <div class="my-6 px-4 md:px-6 lg:px-8">
                <span class="text-sm font-bold">Review</span>
                <textarea v-model="review.content.review" rows="4" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all"></textarea>
            </div>

            <div class="my-6 px-4 md:px-6 lg:px-8">
                <span class="text-sm font-bold">Rating</span>
                <select v-model="review.content.rating" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
                    <option selected value>Select Rating</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                </select>
            </div>

            <div class="my-6 px-4 md:px-6 lg:px-8">
                <button @click="submitReview" class="inline-block mx-2 py-1 px-3 rounded border border-rose-600 bg-rose-600 text-white hover:bg-rose-700 transition-all">
                    Submit
                </button>
                <button @click="closeReview" class="inline-block m-2 py-1 px-3 rounded border border-slate-900 hover:bg-slate-900 hover:text-white transition-all">
                    Cancel
                </button>
            </div>
        </div>
    </div>
</template>