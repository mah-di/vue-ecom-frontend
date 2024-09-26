<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    product: Object
})

const fullTitle = ref(false)

const title = computed(() => {
    let title = ''

    if (fullTitle.value) {
        title = props.product.title
    } else if (!fullTitle.value && props.product.title.length > 25) {
        title = props.product.title.substring(0, 25) + '...'
    } else {
        title = props.product.title
    }

    return title
})
</script>

<template>
    <div class="shadow shadow-slate-200 rounded-sm hover:scale-105 hover:shadow-slate-300 transition-all">
        <router-link :to="{name: 'home'}" class="cursor-pointer">
            <img class="w-full h-[120px] sm:h-[150px] md:h-[180px]" :src="product.image" alt="">
        </router-link>
        <div class="p-4">
            <router-link :to="{name: 'home'}" class="block hover:text-rose-600 cursor-pointer font-semibold product-title-short transition-all">
                {{ title }}
            </router-link>
            <span v-if="product.title.length > 25" @click="fullTitle = !fullTitle" class="cursor-pointer text-slate-600 hover:text-rose-600 text-sm">{{ fullTitle ? 'less' : 'more' }}</span>
            <p class="text-rose-600 font-bold pt-4">$ {{ product.price }}</p>
            <span class="text-sm text-rose-600 font-bold">
                <template v-if="product.star >= 1">
                    <i class="pi pi-star"></i> {{ product.star }} / 5
                </template>
                <template v-else>No Reviews</template>
            </span>
        </div>
    </div>
</template>