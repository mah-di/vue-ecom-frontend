<script setup>
import PageHeader from '@/components/PageHeader.vue';
import ProfileNav from '@/components/ProfileNav.vue';
import useAuthStore from '@/stores/authStore';

const authStore = useAuthStore()
</script>

<template>
    <PageHeader :title="`Welcome, ${ authStore.state.name || authStore.state.email }!`" :showBreadcrumb="false" />
    <ProfileNav />
    <router-view></router-view>
</template>