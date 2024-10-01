<script setup>
import ContentWrapper from './ContentWrapper.vue';

</script>

<template>
    <ContentWrapper :sectionClass="['mt-6', 'shadow-lg', 'shadow-slate-200', '!py-0', '!md:py-0']">
        <div class="flex justify-center">
            <router-link :to="{ name: 'account' }" class="py-2 px-4 font-bold text-center text-[10px] min-[350px]:text-xs min-[480px]:text-sm sm:text-md block rounded-sm hover:text-rose-600 hover:bg-slate-50 transition-all" :activeClass="'text-rose-600 border border-slate-200 border-b-0 shadow-inner shadow-slate-50'">My Account</router-link>
            <router-link :to="{ name: 'order' }" class="py-2 px-4 font-bold text-center text-[10px] min-[350px]:text-xs min-[480px]:text-sm sm:text-md block rounded-sm hover:text-rose-600 hover:bg-slate-50 transition-all" :activeClass="'text-rose-600 border border-slate-200 border-b-0 shadow-inner shadow-slate-50'">My Orders</router-link>
            <router-link :to="{ name: 'cart' }" class="py-2 px-4 font-bold text-center text-[10px] min-[350px]:text-xs min-[480px]:text-sm sm:text-md block rounded-sm hover:text-rose-600 hover:bg-slate-50 transition-all" :activeClass="'text-rose-600 border border-slate-200 border-b-0 shadow-inner shadow-slate-50'">My Cart</router-link>
            <router-link :to="{ name: 'wishlist' }" class="py-2 px-4 font-bold text-center text-[10px] min-[350px]:text-xs min-[480px]:text-sm sm:text-md block rounded-sm hover:text-rose-600 hover:bg-slate-50 transition-all" :activeClass="'text-rose-600 border border-slate-200 border-b-0 shadow-inner shadow-slate-50'">My Wishlist</router-link>
            <router-link :to="{ name: 'review' }" class="py-2 px-4 font-bold text-center text-[10px] min-[350px]:text-xs min-[480px]:text-sm sm:text-md block rounded-sm hover:text-rose-600 hover:bg-slate-50 transition-all" :activeClass="'text-rose-600 border border-slate-200 border-b-0 shadow-inner shadow-slate-50'">My Reviews</router-link>
        </div>
    </ContentWrapper>
</template>