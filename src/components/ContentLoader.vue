<script setup>
import { SemipolarSpinner } from 'epic-spinners';

defineProps({
    loaderClass: String||Array
})
</script>

<template>
    <div class="text-center">
        <SemipolarSpinner
            :animation-duration="2000"
            :size="65"
            :color="'#ff1d5e'"
            class="mx-auto my-[10vh]"
            :class="loaderClass"
        />
    </div>
</template>