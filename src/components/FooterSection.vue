<script setup></script>

<template>
    <footer class="bg-slate-900">
        <div class="py-16 border-b-[1px] border-b-gray-700">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-6">
                <div class="md:col-span-2">
                    <div>
                        <router-link :to="{name: 'home'}">
                            <img src="@/assets/logo_light.png" alt="Logo">
                        </router-link>
                    </div>
                    <p class="text-gray-300 py-12">If you are going to use of Lorem Ipsum need to be sure there isn't hidden of text.</p>
                    <div>
                        <span class="mr-5 text-white hover:text-rose-600 rounded cursor-pointer"><i class="pi pi-facebook"></i></span>
                        <span class="mr-5 text-white hover:text-rose-600 rounded cursor-pointer"><i class="pi pi-twitter"></i></span>
                        <span class="mr-5 text-white hover:text-rose-600 rounded cursor-pointer"><i class="pi pi-google"></i></span>
                        <span class="mr-5 text-white hover:text-rose-600 rounded cursor-pointer"><i class="pi pi-youtube"></i></span>
                        <span class="mr-5 text-white hover:text-rose-600 rounded cursor-pointer"><i class="pi pi-instagram"></i></span>
                    </div>
                </div>
                <div>
                    <h3 class="text-white text-2xl">Quick Links</h3>
                    <div class="text-gray-300 py-6">
                        <router-link :to="{name: 'home'}" class="py-1 block">Home</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'about'}}" class="py-1 block">About</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'how-to-buy'}}" class="py-1 block">How To Buy</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'payment-system'}}" class="py-1 block">Payment System</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'contact'}}" class="py-1 block">Contact</router-link>
                    </div>
                </div>
                <div>
                    <h3 class="text-white text-2xl">Legals</h3>
                    <div class="text-gray-300 py-6">
                        <router-link :to="{name: 'policy', params: {policy: 'user-agreement'}}" class="py-1 block">User Agreement</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'terms-&-conditions'}}" class="py-1 block">Terms & Conditions</router-link>
                        <router-link :to="{name: 'policy', params: {policy: 'privacy-policy'}}" class="py-1 block">Privacy Policy</router-link>
                    </div>
                </div>
                <div>
                    <h3 class="text-white text-2xl">Account</h3>
                    <div class="text-gray-300 py-6">
                        <p class="py-1">Profile</p>
                        <p class="py-1">Wish List</p>
                        <p class="py-1">Cart</p>
                        <p class="py-1">Order History</p>
                    </div>
                </div>
                <div>
                    <h3 class="text-white text-2xl">Contact Info</h3>
                    <div class="text-gray-300 py-6">
                        <p class="py-1"><i class="pi pi-map-marker text-sm mr-2"></i>123 Street, Old Trafford, New South London , UK</p>
                        <p class="py-1"><i class="pi pi-envelope text-sm mr-2"></i>info@apple.com</p>
                        <p class="py-1"><i class="pi pi-mobile text-sm mr-2"></i>123-456-7890</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="py-6">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:flex md:justify-between text-center">
                <div class="text-gray-300">
                    <p>© 2024 All Rights Reserved by Apple Shop</p>
                </div>
                <div>
                    <p class="text-gray-300">
                        Powered by 
                        <span class="text-rose-600">VueJs</span> | 
                        <span class="text-rose-600">Laravel</span> | 
                        <span class="text-rose-600">Tailwind CSS</span> | 
                        <span class="text-rose-600">Prime Icons</span>
                    </p>
                </div>
            </div>
        </div>
    </footer>
</template>