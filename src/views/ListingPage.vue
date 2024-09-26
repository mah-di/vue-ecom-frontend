<script setup>
import PageHeader from '@/components/PageHeader.vue';
import TopBrands from '@/components/TopBrands.vue';
import { computed, onMounted, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';
import { provide, ref } from 'vue';
import PageLoader from '@/components/PageLoader.vue';
import ProductListing from '@/components/ProductListing.vue';
import axios from 'axios';

provide('pageIsLoading', ref(true))

const route = useRoute()
const pageTitle = ref(null)

const identifier = computed(() => route.params.identifier)
const type = computed(() => route.params.type)

const getPageTitle = async () => {
    if (type.value === 'remark') {
        let remark = ''

        for (let word of identifier.value.split('-'))
            remark += word.charAt(0).toUpperCase() + word.slice(1) + ' '

        return pageTitle.value = `${ remark } Products`
    }

    try {
        const response = await axios.get(`http://localhost:8000/api/${ type.value }/${ identifier.value }`)
        const prefix = type.value === 'category' ? 'Category' : 'Brand'

        pageTitle.value = `${ prefix } - ${ response.data.data.name }`
    } catch (error) {
        console.error(error)
    }
}

onMounted( async () => getPageTitle())

onBeforeRouteUpdate( async (to, from, next) => {
    if (identifier.value !== to.params.identifier || type.value !== to.params.type)
        pageTitle.value = null

    return next()
})

watch(() => route.path, async () => getPageTitle())
</script>

<template>
    <PageLoader />
    <PageHeader :title="pageTitle" />
    <ProductListing :identifier="identifier" :type="type" />
    <TopBrands />
</template>