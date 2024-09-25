<script setup>
import FooterSection from './components/FooterSection.vue';
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />
  <router-view></router-view>
  <FooterSection />
</template>
