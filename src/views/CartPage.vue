<script setup>
import CartItem from '@/components/CartItem.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import api from '@/services/api';
import { computed, onMounted, provide, ref } from 'vue';

const cartlist = ref([])
const pageIsLoading = ref(true)
const plainBG = ref(true)

provide('pageIsLoading', pageIsLoading)

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

        response.data.status === "success" && await get()
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const subTotal = computed(() => {
    let total = 0

    cartlist.value.forEach( cart => {
        let price = cart.product.discount > 0 ? cart.product.discount_price : cart.product.price
        total += price * cart.qty
    })

    return total
})

const vat = computed(() => subTotal.value * 0.05)

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
                <button class="block w-full py-3 rounded border bg-rose-600 hover:bg-rose-700 text-white font-bold transition-all">Checkout</button>
            </div>
        </template>
    </ContentWrapper>
</template>