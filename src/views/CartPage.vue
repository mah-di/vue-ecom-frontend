<script setup>
import CartItem from '@/components/CartItem.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import { computed, onMounted, provide, reactive, ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast()

const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

const cartlist = ref([])

const subTotal = computed(() => {
    let total = 0

    cartlist.value.forEach( cart => {
        let price = cart.product.discount > 0 ? cart.product.discount_price : cart.product.price
        total += price * cart.qty
    })

    return total
})

const vat = computed(() => subTotal.value * 0.05)

const paymentData = reactive({
    getways: [],
    total: null,
    vat: null,
    payable: null
})

const get = async () => {
    pageIsLoading.value = true
    try {
        const response = await api.get('/user/cart')

        cartlist.value = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
        plainBG.value = false
    }
}

const updateCart = (productId, qty, remaining_stock) => cartlist.value.map( cart => cart.product_id === productId && ( cart.product.stock = remaining_stock ) && ( cart.qty = qty ))

const clearCart = async () => {
    pageIsLoading.value = true

    try {
        let response = await api.delete('/user/cart')

        response.data.status === "success"
            ? toast.success(response.data.message)
            : toast.error(response.data.message)

        response.data.status === "success" && await get()
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const checkout = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.get('/invoice/place?app=vue')

        if (response.data.status === 'success') {
            paymentData.getways.push(...response.data.data.payment_methods)
            paymentData.total = response.data.data.total
            paymentData.vat = response.data.data.vat
            paymentData.payable = response.data.data.payable
        }
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

onMounted( async () => await get())
</script>

<template>
    <PageLoader :plainBG="plainBG" />
    <ContentWrapper>
        <h2 class="text-2xl font-bold text-slate-600 text-center">Cartlist</h2>

        <ContentWrapper v-if="cartlist.length === 0">
            <h2 class="text-2xl font-bold text-slate-600 text-center">Oops, Nothing To Show...</h2>
        </ContentWrapper>

        <template v-else>
            <div class="my-8">
                <div class="text-end pb-4">
                    <button @click="clearCart" class="text-rose-600 border border-rose-600 px-8 py-2 rounded font-semibold hover:text-white hover:bg-rose-600 transition-all"><i class="pi pi-trash"></i> Clear Cart</button>
                </div>

                <CartItem @getCart="get" @updateCart="updateCart" v-for="(cart, index) in cartlist" :cartItem="cart" :key="index" />
            </div>

            <div class="py-4 border-t border-b border-t-slate-200 border-b-slate-200">
                <div class="flex justify-between">
                    <span>Sub Total</span>
                    <span class="font-bold">৳ {{ subTotal }}</span>
                </div>
                <div class="flex justify-between mt-2">
                    <span>Vat (5%)</span>
                    <span class="font-bold">৳ {{ vat }}</span>
                </div>
            </div>

            <div class="pt-4 flex justify-between">
                <span>Grand Total</span>
                <span class="font-bold">৳ {{ subTotal + vat }}</span>
            </div>

            <div class="my-16">
                <button @click="checkout" class="block w-full py-3 rounded border bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">Checkout</button>
            </div>

            <div v-if="paymentData.getways.length > 0" @click.self="paymentData.getways = []" class="fixed h-full w-full top-0 left-0 bg-[rgba(0,0,0,0.5)] z-50 flex justify-center items-center">
                <div class="bg-white w-[90%] sm:w-[480px] h-[90%] overflow-y-auto">
                    <div class="text-center px-4 md:px-6 lg:px-8 py-6 bg-slate-100 border-b-4 border-b-slate-600">
                        <h2 class="text-2xl font-bold text-slate-900">Select a Payment Getway</h2>
                    </div>
                    <template v-for="(getway, index) in paymentData.getways" :key="index">
                        <a :href="getway.redirectGatewayURL">
                            <div class="w-full px-4 md:px-6 lg:px-8 py-3 border-b border-b-slate-200 hover:bg-slate-50 transition-all">
                                <div class="flex justify-between items-center">
                                    <img :src="getway.logo" :alt="getway.type" class="w-16 h-12 rounded object-cover">
                                    <span>{{ getway.name }}</span>
                                    <i class="pi pi-arrow-right"></i>
                                </div>
                            </div>
                        </a>
                    </template>
                </div>
            </div>
        </template>
    </ContentWrapper>
</template>