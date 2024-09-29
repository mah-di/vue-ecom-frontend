<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import useAuthStore from '@/stores/authStore';

const authStore = useAuthStore()
</script>

<template>
    <ContentWrapper :sectionClass="['py-[20vh]', 'md:py-[20vh]']">
        <div class="max-w-[600px] mx-auto shadow-lg shadow-slate-200">
            <div class="py-6 px-12 bg-rose-600">
                <h1 class="text-xl text-white font-bold">Login</h1>
            </div>
            <div class="py-8 px-12 bg-slate-50">
                <div class="mb-4">
                    <label for="email" class="block mb-1 text-sm font-semibold">Email</label>
                    <input v-model="authStore.state.email" type="email" id="email" class="w-full p-2 border border-rose-600 focus:outline-rose-700 rounded transition-all">
                </div>
                <div class="py-4">
                    <button @click="authStore.requestOTP" class="block w-full py-3 rounded border bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">Send OTP</button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>