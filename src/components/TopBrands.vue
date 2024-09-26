<script setup>
import { onMounted } from 'vue';
import HighlightCards from './HighlightCards.vue';
import useBrandStore from '@/stores/brandStore';

const brandStore = useBrandStore()

onMounted(async () => await brandStore.get())
</script>

<template>
    <HighlightCards title="Top Brands" :items="brandStore.brands" :isLoading="brandStore.isLoading" type="brands" />
</template>