<script setup>
defineProps({
    description: String
})
</script>

<template>
    <div>
        <p v-if="!description" class="text-center text-rose-600 font-bold text-2xl">Nothing to Show</p>
        <p class="text-md">{{ description }}</p>
    </div>
</template>