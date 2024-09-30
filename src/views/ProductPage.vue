<script setup>
import BrandRelatedProducts from '@/components/BrandRelatedProducts.vue';
import ContentWrapper from '@/components/ContentWrapper.vue';
import PageLoader from '@/components/PageLoader.vue';
import ProductContent from '@/components/ProductContent.vue';
import ProductDetail from '@/components/ProductDetail.vue';
import ProductReview from '@/components/ProductReview.vue';
import RelatedProducts from '@/components/RelatedProducts.vue';
import TopBrands from '@/components/TopBrands.vue';
import api from '@/services/api';
import { computed, onMounted, provide, reactive, ref, shallowRef, watch } from 'vue';
import { onBeforeRouteUpdate, useRoute } from 'vue-router';

const route = useRoute()

const activeContent = shallowRef(ProductDetail)
const activeTab = ref('detail')
const pageIsLoading = ref(true)
provide('pageIsLoading', pageIsLoading)

const state = reactive({
    product: null,
    productDetail: null
})
const id = computed(() => route.params.id)

const get = async () => {
    try {
        const prodResponse = await api.get(`/product/${ id.value }`)
        state.product = prodResponse.data.data

        const detailResponse = await api.get(`/product/${ id.value }/detail`)
        state.productDetail = detailResponse.data.data
    } catch (error) {
        console.error(error)
    } finally {
        pageIsLoading.value = false
    }
}

const changeActiveContent = (content, tab) => {
    activeContent.value = content
    activeTab.value = tab
}

const props = computed(() => {
    if (activeTab.value == 'detail' && !pageIsLoading.value)
        return { description: state.productDetail ? state.productDetail.des : null }

    return {}
})

onMounted( async () => get())

onBeforeRouteUpdate( async (to, from, next) => {
    state.product = null
    state.productDetail = null
    pageIsLoading.value = true
    return next()
})

watch(() => route.path, async () => await get())
</script>

<template>
    <PageLoader />
    <template v-if="!pageIsLoading">
        <ProductContent :product="state.product" :productDetail="state.productDetail" />

        <ContentWrapper >
            <div class="border-b border-b-slate-200">
                <span @click="changeActiveContent(ProductDetail, 'detail')" class="inline-block px-4 py-2 cursor-pointer hover:bg-slate-50 hover:text-rose-600" :class="activeTab == 'detail' ? ['text-rose-600', 'bg-slate-50'] : 'text-slate-600'">Details</span>
                <span @click="changeActiveContent(ProductReview, 'review')" class="inline-block px-4 py-2 cursor-pointer hover:bg-slate-50 hover:text-rose-600" :class="activeTab == 'review' ? ['text-rose-600', 'bg-slate-50'] : 'text-slate-600'">Reviews</span>
            </div>
            <div class="py-12">
                <keep-alive>
                    <component :is="activeContent" v-bind="props"></component>
                </keep-alive>
            </div>
        </ContentWrapper>
        <hr>
        <RelatedProducts :product="state.product" />
        <BrandRelatedProducts :brand="state.product.brand" :productId="state.product.id" />
        <TopBrands />
    </template>
</template>