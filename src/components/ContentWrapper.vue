<script setup>
defineProps({
    sectionClass: Array
})
</script>

<template>
    <section class="max-w-7xl mx-auto py-12 md:py-24 px-4 sm:px-6 lg:px-8" :class="sectionClass">
        <slot></slot>
    </section>
</template>