<script setup>
import { SemipolarSpinner } from 'epic-spinners';
import { inject } from 'vue';

const pageIsLoading = inject('pageIsLoading')

defineProps({
    plainBG: {
        type: Boolean,
        default: true
    }
})
</script>

<template>
    <div v-if="pageIsLoading" class="fixed z-[100] top-0 left-0 h-[100vh] w-[100vw] bg-white flex justify-center items-center text-center" :class="plainBG ? '' : 'opacity-95'">
        <SemipolarSpinner
            :animation-duration="2000"
            :size="65"
            :color="'#ff1d5e'"
        />
    </div>
</template>