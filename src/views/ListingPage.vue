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
    if (type.value === 'remarks') {
        let remark = ''

        for (let word of identifier.value.split('-'))
            remark += word.charAt(0).toUpperCase() + word.slice(1) + ' '

        return pageTitle.value = remark
    }

    try {
        const response = await axios.get(`http://localhost:8000/api/${ type.value }/${ identifier.value }`)
        const prefix = type.value === 'categories' ? 'Category' : 'Brand'

        pageTitle.value = `${ prefix } - ${ response.data.data.name }`
    } catch (error) {
        console.error(error)
    }
}

onMounted(async () => getPageTitle())

onBeforeRouteUpdate(async (to, from, next) => {
    pageTitle.value = null
    return next()
})

watch(() => route.path, () => getPageTitle())
</script>

<template>
    <PageLoader />
    <PageHeader :title="pageTitle" />
    <ProductListing :identifier="identifier" :type="type" />
    <TopBrands />
</template>