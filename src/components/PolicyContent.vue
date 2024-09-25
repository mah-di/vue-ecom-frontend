<script setup>
import { inject, onMounted, ref, watch } from 'vue';
import ContentLoader from './ContentLoader.vue';
import axios from 'axios';
import ContentWrapper from './ContentWrapper.vue';
import { onBeforeRouteUpdate } from 'vue-router';

const props = defineProps({
    policy: String
})
const pageIsLoading = inject('pageIsLoading')
const content = ref('')

const get = async () => {
    try {
        const response = await axios.get(`http://localhost:8000/api/policy/${ props.policy }`)
        content.value = response.data.data.des
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

onMounted( async () => await get())

onBeforeRouteUpdate( async (to, from, next) => {
    content.value = ''
    pageIsLoading.value = true
    next()
})

watch(() => props.policy, async () => await get())
</script>

<template>
    <ContentLoader v-if="pageIsLoading" />
    <ContentWrapper v-else>{{ content }}</ContentWrapper>
</template>