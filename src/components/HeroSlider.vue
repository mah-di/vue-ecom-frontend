<script setup>
import 'vue3-carousel/dist/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { inject, onMounted, ref } from 'vue';
import axios from 'axios';
import ContentLoader from './ContentLoader.vue';

const pageIsLoading = inject('pageIsLoading')

const items = ref([])

onMounted(async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/product-slider')
        if (response.data.status === "success") {
            items.value.push(...response.data.data)
        }
    } catch (error) {
        console.error(error);
    } finally {
        pageIsLoading.value = false
    }
})
</script>

<template>
    <ContentLoader v-if="pageIsLoading" :loaderClass="'h-[70vh]'" />

    <Carousel v-else :items-to-show="1" :autoplay="3000" :wrap-around="true">
      <Slide v-for="item in items" :key="item.id">
        <div class="carousel__item bg-cover bg-center w-full h-[70vh]" :style="{'background-image': `url('${item.image}')`}">
            <div class="flex items-center bg-black/50 h-full">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
                    <p class="text-white">{{ item.pricing }}</p>
                    <h1 class="text-white text-5xl font-bold my-16">{{ item.title }}</h1>
                    <router-link :to="{name: 'product', params: {id: item.product_id}}" class="inline bg-rose-600 text-white p-3 rounded font-semibold mt-4 hover:bg-rose-700 transition-all">Shop Now</router-link>
                </div>
            </div>
        </div>
      </Slide>
  
      <template #addons>
        <Navigation />
        <Pagination />
      </template>
    </Carousel>
  </template>