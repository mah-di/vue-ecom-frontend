<script setup>
import HighlightCards from './HighlightCards.vue';
import useCategoryStore from '@/stores/categoryStore';

const categoryStore = useCategoryStore()
</script>

<template>
    <HighlightCards title="Top Categories" :items="categoryStore.categories" :isLoading="categoryStore.isLoading" type="category" />
</template>