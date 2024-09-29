<script setup>
import PageHeader from '@/components/PageHeader.vue';
import TopBrands from '@/components/TopBrands.vue';
import { computed, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { provide, ref } from 'vue';
import PageLoader from '@/components/PageLoader.vue';
import ProductListing from '@/components/ProductListing.vue';

provide('pageIsLoading', ref(true))

const route = useRoute()
const pageTitle = ref(null)

const query = computed(() => route.query.q)

const getPageTitle = () => pageTitle.value = `Search Result for "${ query.value }"`

onMounted(() => getPageTitle())

onBeforeRouteUpdate( async (to, from, next) => {
    pageTitle.value = null

    return next()
})

watch(() => route.fullPath, () => getPageTitle())
</script>

<template>
    <PageLoader />
    <PageHeader :title="pageTitle" />
    <ProductListing />
    <TopBrands />
</template>