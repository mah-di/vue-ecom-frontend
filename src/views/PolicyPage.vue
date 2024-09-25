<script setup>
import PageHeader from '@/components/PageHeader.vue';
import PolicyContent from '@/components/PolicyContent.vue';
import TopBrands from '@/components/TopBrands.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { provide, ref } from 'vue';
import PageLoader from '@/components/PageLoader.vue';

provide('pageIsLoading', ref(true))

const route = useRoute()

const policy = computed(() => route.params.policy.replace(/-/g, ' '))
const title = computed(() => {
    let title = ''
    for (let word of policy.value.split('-')) {
        title += word.charAt(0).toUpperCase() + word.slice(1) + ' '
    }
    return title
})
</script>

<template>
    <PageLoader />
    <PageHeader :title="title" />
    <PolicyContent :policy="policy" />
    <TopBrands />
</template>