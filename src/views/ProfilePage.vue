<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageHeader from '@/components/PageHeader.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import useAuthStore from '@/stores/authStore';
import { onMounted, provide, reactive, ref } from 'vue';

const pageIsLoading = ref(true)
provide('pageIsLoading', pageIsLoading)

const authStore = useAuthStore()

const profile = reactive({
    cus_name : null,
    cus_address : null,
    cus_city : null,
    cus_state : null,
    cus_postcode : null,
    cus_country : null,
    cus_phone : null,
    ship_name : null,
    ship_address : null,
    ship_city : null,
    ship_state : null,
    ship_postcode : null,
    ship_country : null,
    ship_phone : null,
})

const getProfile = async () => {
    try {
        const response = await api.get('/profile')
        if (response.data.status === "success" && response.data.data) {
            Object.assign(profile, response.data.data)
        }
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

onMounted( async () => await getProfile())

const save = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.post('/profile', profile)
        if (response.data.status === "success") {
            Object.assign(profile, response.data.data)

            authStore.state.name = profile.cus_name
        }
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const fillupShipping = () => {
    profile.ship_name = profile.cus_name
    profile.ship_address = profile.cus_address
    profile.ship_city = profile.cus_city
    profile.ship_state = profile.cus_state
    profile.ship_postcode = profile.cus_postcode
    profile.ship_country = profile.cus_country
    profile.ship_phone = profile.cus_phone
}
</script>

<template>
    <PageLoader />
    <PageHeader title="Profile" :showBreadcrumb="false" />
    <ContentWrapper>
        <h3 class="text-xl textslate-900 font-bold">Billing Details</h3>
        
        <div class="mt-6 pt-6 border-t border-t-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <p class="text-slate-900 font-semibold mb-1">Name</p>
                <input v-model="profile.cus_name" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Address</p>
                <input v-model="profile.cus_address" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">City</p>
                <input v-model="profile.cus_city" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">State</p>
                <input v-model="profile.cus_state" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Post Code</p>
                <input v-model="profile.cus_postcode" type="number" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Country</p>
                <input v-model="profile.cus_country" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Phone</p>
                <input v-model="profile.cus_phone" type="tel" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
        </div>
        
        <div class="mt-24 flex justify-between">
            <h3 class="text-xl textslate-900 font-bold">Shipping Details</h3>
            <button @click="fillupShipping" class="block py-2 px-6 text-center rounded border border-rose-600 text-rose-600 hover:bg-rose-600 hover:text-white transition-all">Same As Billing</button>
        </div>
        <div class="mt-6 pt-6 border-t border-t-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
                <p class="text-slate-900 font-semibold mb-1">Name</p>
                <input v-model="profile.ship_name" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Address</p>
                <input v-model="profile.ship_address" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">City</p>
                <input v-model="profile.ship_city" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">State</p>
                <input v-model="profile.ship_state" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Post Code</p>
                <input v-model="profile.ship_postcode" type="number" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Country</p>
                <input v-model="profile.ship_country" type="text" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
            <div>
                <p class="text-slate-900 font-semibold mb-1">Phone</p>
                <input v-model="profile.ship_phone" type="tel" class="w-full p-2 border border-slate-200 focus:outline-rose-700 rounded transition-all">
            </div>
        </div>

        <button @click="save" class="block w-full mt-24 py-3 rounded border bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">Save</button>
    </ContentWrapper>
</template>