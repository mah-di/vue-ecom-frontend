<script setup>
import { ref } from 'vue';
import ContentLoader from './ContentLoader.vue';
import ContentWrapper from './ContentWrapper.vue';

defineProps({
    title: String,
    items: Array,
    isLoading: Boolean,
    type: String
})

const open = ref(false)
</script>

<template>
    <ContentWrapper :sectionClass="['text-center']">
        <h1 class="text-3xl font-bold text-slate-900">{{ title }}</h1>

        <div
            @click="open = !open"
            class="text-center text-rose-600 cursor-pointer md:hidden text-3xl my-6 py-2 bg-slate-100"
        >
            <i
                class="pi"
                :class="open ? 'pi-chevron-up' : 'pi-chevron-down'"
            ></i>
        </div>

        <ContentLoader v-if="isLoading" />

        <div class="md:grid lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-4 mt-6 md:mt-16" :class="open ? 'grid' : 'hidden'">
            <router-link :to="{name: 'listing', params: {type: type, identifier: item.id}}" v-for="item in items" :key="item.id" class="bg-slate-100 p-4">
                <div>
                    <img class="w-full h-[135px]" :src="item.img" alt="Logo">
                    <p class="hover:text-rose-600 pt-2.5">{{ item.name }}</p>
                </div>
            </router-link>
        </div>
    </ContentWrapper>
</template>