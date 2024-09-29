<script setup>
import useAuthStore from '@/stores/authStore';
import useCategoryStore from '@/stores/categoryStore';
import { onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router';

const route = useRoute()

const openCategories = ref(false)
const openMenu = ref(false)
const openSearch = ref(false)
const searchVal = ref('')

const categoryStore = useCategoryStore()
const authStore = useAuthStore()

onMounted(async () => await categoryStore.get())

watch(() => route.fullPath, () => {
    openCategories.value = false
    openMenu.value = false
    openSearch.value = false
    searchVal.value = ''
})
</script>

<template>
    <nav class="bg-white border-b-gray-200 sticky w-full top-0 z-50 shadow-md shadow-slate-500">
        <div class="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 md:flex md:justify-between">
            <div class="flex items-center justify-between">
                <span class="px-4 py-2 text-sm text-rose-600"><i class="pi pi-mobile text-sm mr-2"></i>123-456-7890</span>
                <span class="px-4 py-2 text-sm text-rose-600"><i class="pi pi-envelope text-sm mr-2"></i>info@apple.com</span>
            </div>
            <div class="hidden md:flex md:items-center md:justify-between">
                <router-link :to="{ name: 'policy', params: { policy: 'about' }}" class="px-4 py-2 hover:text-rose-600 hover:bg-slate-50 transition-all">About</router-link>
                <router-link :to="{ name: 'profile' }" class="px-4 py-2 hover:text-rose-600 hover:bg-slate-50 transition-all"><i class="pi pi-user text-sm mr-2"></i>Account</router-link>
                <button v-if="authStore.isAuthenticated" @click="authStore.logout" class="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded cursor-pointer transition-all">Logout</button>
                <router-link v-else :to="{ name: 'login' }" class="px-4 py-2 bg-rose-600 text-white hover:bg-rose-700 rounded cursor-pointer transition-all">Login</router-link>
            </div>
        </div>
        <hr class="border-b-amber-200">
        <div class="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 md:flex md:justify-between text-center">
            <div class="flex items-center justify-between">
                <router-link :to="{ name: 'home' }" class="px-4 py-2 cursor-pointer">
                    <img src="@/assets/logo.png" alt="Logo">
                </router-link>
                <span @click="openMenu = !openMenu" class="px-4 py-2 hover:text-rose-600 block md:hidden rounded hover:bg-slate-50 cursor-pointer transition-all"><i class="pi pi-bars text-lg mr-2"></i></span>
            </div>
            <div class="md:flex md:items-center md:justify-between" :class="openMenu ? 'block' : 'hidden'">
                <router-link :to="{ name: 'home' }" class="px-4 py-2 hover:text-rose-600 block md:inline hover:bg-slate-50 transition-all">Home</router-link>
                <router-link :to="{ name: 'profile' }" class="px-4 py-2 block md:hidden hover:text-rose-600 hover:bg-slate-50 transition-all"><i class="pi pi-user text-sm mr-2"></i>Account</router-link>
                <router-link :to="{ name: 'policy', params: { policy: 'about' }}" class="px-4 py-2 block md:hidden hover:text-rose-600 hover:bg-slate-50 transition-all">About</router-link>
                <div>
                    <span @click="openCategories = !openCategories" class="px-4 py-2 hover:text-rose-600 block md:inline hover:bg-slate-50 cursor-pointer transition-all">Categories
                        <i class="pi text-sm ml-2" :class="openCategories ? 'pi-chevron-up' : 'pi-chevron-down'"></i>
                    </span>
                    <div v-show="openCategories" class="md:mt-10 md:absolute md:top-100 max-h-[50vh] overflow-auto w-full md:min-w-[150px] md:max-w-[300px] rounded border border-gray-50 bg-white">
                        <router-link :to="{ name: 'listing', params: { type: 'category', identifier: category.id }}" v-for="category in categoryStore.categories" :key="category.id" class="block px-4 py-2 hover:text-rose-600 hover:bg-slate-50 border-b border-b-gray-200 hover:border-b-rose-500 transition-all">{{ category.name }}</router-link>
                    </div>
                </div>
                <span class="px-4 py-2 hover:text-rose-600 block md:inline hover:bg-slate-50 transition-all"><i class="pi pi-heart text-sm mr-2"></i>Wish</span>
                <span class="px-4 py-2 hover:text-rose-600 block md:inline hover:bg-slate-50 transition-all"><i class="pi pi-shopping-cart text-sm mr-2"></i>Cart</span>
                <span @click="openSearch = true" class="px-4 py-2 hover:text-rose-600 block md:inline hover:bg-slate-50 cursor-pointer transition-all"><i class="pi pi-search text-sm mr-2"></i>Search</span>
                <button v-if="authStore.isAuthenticated" @click="authStore.logout" class="w-full py-2 block md:hidden bg-rose-600 text-white hover:bg-rose-700 rounded cursor-pointer transition-all">Logout</button>
                <router-link v-else :to="{ name: 'login' }" class="py-2 block md:hidden bg-rose-600 text-white hover:bg-rose-700 rounded cursor-pointer transition-all">Login</router-link>
            </div>
        </div>
    </nav>

    <div v-show="openSearch" class="fixed top-0 h-[100vh] w-[100vw] bg-black opacity-60 z-50 flex justify-center items-center">
        <span class="absolute top-10 right-10"><i class="pi pi-times text-3xl text-white cursor-pointer" @click="openSearch = false"></i></span>
        <div>
            <div class="border-b-2 border-b-slate-200">
                <input v-model="searchVal" type="text" class="py-3 w-[60vw] rounded text-white mr-2 bg-inherit focus:outline-none" placeholder="Search Products">
                <span v-show="!searchVal" class="inline bg-inherit text-white p-3 rounded font-semibold cursor-pointer"><i class="pi pi-search"></i></span>
                <router-link v-show="searchVal" :to="{ name: 'search', query: { q: searchVal }}" @click="openSearch = false"  class="inline bg-inherit text-white p-3 rounded font-semibold"><i class="pi pi-search"></i></router-link>
            </div>
        </div>
    </div>
</template>