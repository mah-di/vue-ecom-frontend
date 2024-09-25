<script setup>
import ExclusiveProducts from '@/components/ExclusiveProducts.vue';
import HeroSlider from '@/components/HeroSlider.vue';
import PageLoader from '@/components/PageLoader.vue';
import TopBrands from '@/components/TopBrands.vue';
import TopCategories from '@/components/TopCategories.vue';
import { provide, ref } from 'vue';

provide('pageIsLoading', ref(true))
</script>

<template>
    <PageLoader />
    <HeroSlider />
    <TopCategories />
    <ExclusiveProducts />
    <TopBrands />
</template>