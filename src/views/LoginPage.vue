<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import useAuthStore from '@/stores/authStore';
import { onMounted, provide, ref } from 'vue';
import { useToast } from 'vue-toastification';

const pageIsLoading = ref(true)
provide('pageIsLoading', pageIsLoading)

const authStore = useAuthStore()
const toast = useToast()

onMounted(() => pageIsLoading.value = false)

const requestOTP = async () => {
    pageIsLoading.value = true
    const response = await authStore.requestOTP()

    if (response.status === "error") {
        pageIsLoading.value = false
        toast.error(response.message)
        return
    }

    toast.success(response.message)
}
</script>

<template>
    <PageLoader />
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
                    <button @click="requestOTP" class="block w-full py-3 rounded border bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">Send OTP</button>
                </div>
            </div>
        </div>
    </ContentWrapper>
</template>