<script setup>
import api from '@/services/api';
import { computed, inject, reactive } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast()

const pageIsLoading = inject('pageIsLoading')

const props = defineProps({
    cartItem: Object
})

const emit = defineEmits(['getCart', 'updateCart'])

const cart = reactive({
    product_id: props.cartItem.product_id,
    size: props.cartItem.size,
    color: props.cartItem.color,
    qty: props.cartItem.qty
})

const remove = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.delete(`/user/cart/${ props.cartItem.id }`)

        response.data.status === "success"
            ? toast.success(response.data.message)
            : toast.error(response.data.message)
    } catch (error) {
        console.error(error)
    } finally {
        emit('getCart')
    }
}

const total = computed(() => props.cartItem.discount ? props.cartItem.qty * props.cartItem.product.discount_price : props.cartItem.qty * props.cartItem.product.price)

const updateCart = async () => {
    pageIsLoading.value = true

    try {
        const response = await api.post('/user/cart?add_stock=true', cart)

        if (response.data.status === "error") {
            cart.qty = props.cartItem.qty
            response.data.data = { remaining_stock: 0 }

            toast.error(response.data.message)
        } else {
            toast.success(response.data.message)
        }

        emit('updateCart', props.cartItem.product_id, cart.qty, response.data.data.remaining_stock)
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}
</script>

<template>
    <div class="py-6 border-t border-t-slate-200 grid grid-cols-5 sm:grid-cols-7 gap-2 sm:gap-6">
        <div>
            <router-link :to="{ name: 'product', params: { id: cartItem.product.id } }">
                <img :src="cartItem.product.image" :alt="cartItem.product.title" class="w-20 sm:h-20 min-[480px]:h-12 h-8 object-cover">
            </router-link>
        </div>

        <div class="col-span-4">
            <router-link :to="{ name: 'product', params: { id: cartItem.product.id } }">
                <h3 class="text-lg font-bold text-slate-800 hover:text-rose-600 cursor-pointer">{{ cartItem.product.title }}</h3>
            </router-link>
            <p class="text-slate-500 mt-2">Price: ৳ {{ cartItem.product.price }}</p>
            <p v-if="cartItem.color && cartItem.size" class="text-slate-500 mt-2">Color: {{ cartItem.color }} | Size: {{ cartItem.size }}</p>
        </div>

        <div class=" flex col-span-5 sm:col-span-2 justify-between mt-3 pt-6 border-t border-t-slate-50 sm:mt-0 sm:pt-0 sm:border-t-0">
            <div class="text-center block md:inline">
                <button @click="cart.qty-- && updateCart()" :disabled="cart.qty == 1" class="py-[4px] px-[6px] text-xs rounded-full border border-rose-600 hover:bg-rose-600 hover:text-white disabled:bg-slate-200 disabled:border-slate-200 disabled:text-inherit transition-all"><i class="pi pi-minus"></i></button>
                <span class="w-16 text-center py-[4px] px-4 border border-rose-600 focus:outline-none rounded mx-2">{{ cart.qty }}</span>
                <button @click="cart.qty++ && updateCart()" :disabled="cartItem.product.stock === 0" class="py-[4px] px-[6px] text-xs rounded-full border border-rose-600 hover:bg-rose-600 hover:text-white disabled:bg-slate-200 disabled:border-slate-200 disabled:text-inherit transition-all"><i class="pi pi-plus"></i></button>
            </div>
            <i @click="remove" class="pi pi-trash text-xl text-rose-600 hover:text-rose-700 cursor-pointer transition-all"></i>
        </div>
    </div>

    <div class="pt-2 flex justify-between">
        <span class="text-slate-600">Total</span>
        <span class="font-bold text-slate-600">
            <span class="font-bold text-slate-600 mr-4">({{ cartItem.product.discount ? cartItem.product.discount_price : cartItem.product.price }} x {{ cart.qty }})</span>
            <span class="font-bold text-slate-600 mr-4">=</span>
            <span class="font-bold text-slate-600">৳ {{ total }}</span>
        </span>
    </div>
</template>