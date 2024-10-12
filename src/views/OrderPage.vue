<script setup>
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import { onMounted, provide, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from 'vue-toastification';

const toast = useToast()
const route = useRoute()

const orders = ref([])
const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

const get = async () => {
    pageIsLoading.value = true
    try {
        const response = await api.get('/invoice')

        orders.value = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
        plainBG.value = false
    }
}

const getDate = (dt) => {
    const date = new Date(dt)

    return `${ date.getDate() } ${ date.toLocaleString('default', { month: 'short' }) } ${ date.getFullYear() } `
}

onMounted( async () => {
    route.query.status === 'success' && toast.success("Order placed successfully.")
    await get()
})

</script>

<template>
    <PageLoader :plainBG="plainBG" />
    <ContentWrapper :sectionClass="['px-0']">
        <h2 class="text-2xl font-bold text-slate-600 text-center">Past Orders</h2>

        <ContentWrapper v-if="orders.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </ContentWrapper>

        <template v-else>
            <div class="my-8 overflow-x-auto">
                <div class="min-w-[600px] py-3 bg-slate-200 grid grid-cols-6 gap-2 sm:gap-6 text-center">
                    <div>Date</div>
                    <div>Order ID</div>
                    <div>Transaction ID</div>
                    <div>Payment Status</div>
                    <div>Delivery Status</div>
                    <div>Total</div>
                </div>

                <router-link v-for="(order, index) in orders" :key="index" :to="{ name: 'singleOrder', params: { id: order.id }}">
                    <div class="min-w-[600px] py-4 text-center border-b border-b-slate-200 grid grid-cols-6 gap-2 sm:gap-6 cursor-pointer hover:bg-slate-50 transition-all">
                        <div>{{ getDate(order.created_at) }}</div>
                        <div>{{ order.id }}</div>
                        <div>{{ order.transaction_id }}</div>
                        <div>{{ order.payment_status }}</div>
                        <div>{{ order.delivery_status }}</div>
                        <div>৳ {{ order.payable }}</div>
                    </div>
                </router-link>
            </div>
        </template>
    </ContentWrapper>
</template>