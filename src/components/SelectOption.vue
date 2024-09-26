<script setup>
defineProps({
    modelValue: String,
    options: Array,
    defaultValue: String
})

defineEmits(['update:modelValue'])
</script>

<template>
    <select :value="modelValue" @input="$emit('update:modelValue', ($event.target.value ? $event.target.value : null))" class="p-2 rounded border border-rose-600 block w-full">
        <option value>{{ defaultValue }}</option>
        <option v-for="option in options" :key="option.id" :value="option.id">{{ option.name }}</option>
    </select>
</template>