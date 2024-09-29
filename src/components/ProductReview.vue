<script setup>
import axios from 'axios';
import { computed, onActivated, reactive } from 'vue';
import { useRoute } from 'vue-router';
import ContentLoader from './ContentLoader.vue';

const route = useRoute()

const id = computed(() => route.params.id)
const state = reactive({
    reviews: null,
    isLoading: true
})

const getReviews = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/product/${ id.value }/review`)
        state.reviews = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        state.isLoading = false
    }
}

const getDate = (dt) => {
    const date = new Date(dt)

    return `${ date.getDate() } ${ date.toLocaleString('default', { month: 'short' }) } ${ date.getFullYear() } `
}

onActivated( async () => await getReviews())
</script>

<template>
    <ContentLoader v-if="state.isLoading" />
    <div v-else-if="state.reviews.length === 0" class="text-center text-rose-600 font-bold text-2xl">No Reviews</div>
    <section v-else class="-mt-4">
        <div v-for="review in state.reviews" :key="review.id" class="border-b border-b-slate-200 py-4">
            <p class="text-lg text-slate-900 font-bold">{{ review.customer ? review.customer.cus_name : 'Anonymous' }}</p>
            <span class="text-sm text-slate-600">{{ getDate(review.updated_at) }}</span>
            <p class="my-2 text-slate-900">{{ review.review || 'No Review' }}</p>
            <p class="text-rose-600 text-sm">Rating : <i class="pi pi-star ml-2"></i> {{ review.rating }} / 5</p>
        </div>
    </section>
</template>