<script setup>
import ContentWrapper from './ContentWrapper.vue';

defineProps({
    title: String,
    showBreadcrumb: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <section class="bg-slate-50">
        <ContentWrapper :sectionClass="['flex', 'justify-between']">
            <h1 class="text-3xl font-bold text-slate-900">{{ title }}</h1>
            <span v-if="showBreadcrumb"><router-link :to="{name: 'home'}" class="text-rose-600 hover:text-rose-700 transition-all">Home</router-link> <i class="pi pi-angle-right text-xs"></i> This Page</span>
        </ContentWrapper>        
    </section>
</template>