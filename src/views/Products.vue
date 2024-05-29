<script setup>
  import { ref, reactive, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import BaseIcon from '@/UI/BaseIcon.vue'
  import MTextFiled from '@/UI/MTextFiled.vue'
  import MButton from '@/UI/MButton.vue'
  import MPagination from '@/UI/MPagination.vue'
  import MiniProduct from '@/components/MiniProduct.vue'
  import HomeShimmer from '@/components/shimmers/HomeShimmer.vue'
  import SortBottom from '@/components/SortBottom.vue'
  import SelectPopUp from '@/UI/MPopUpDropdown/SelectPopUp.vue'
  import PopUpConfirmDelete from '@/components/PopUpConfirmDelete.vue'

  import { GET_PRODUCTS, DELETE_PRODUCT } from '@/api/product.api'

  import { useCategories } from '@/composables/productCategories'
  import { useTags } from '@/composables/productTags'

  const router = useRouter()
  const route = useRoute()

  const { t } = useI18n()

  const products = ref([])

  const sorts = ref([
    { id: 1, key: 'sort_date', value: 'dec', name: t('sortDateDec') },
    { id: 2, key: 'sort_date', value: 'asc', name: t('sortDateAsc') },
    { id: 4, key: 'name', value: 'dec', name: t('nameDec') },
    { id: 3, key: 'name', value: 'asc', name: t('nameAsc') },
    { id: 6, key: 'price', value: 'dec', name: t('priceDec') },
    { id: 5, key: 'price', value: 'asc', name: t('priceAsc') },
    { id: 8, key: 'discount', value: 'dec', name: t('discountDec') },
    { id: 7, key: 'discount', value: 'asc', name: t('discountAsc') },
    { id: 10, key: 'old_price', value: 'dec', name: t('oldPriceDec') },
    { id: 9, key: 'old_price', value: 'asc', name: t('oldPriceAsc') },
    { id: 12, key: 'sold', value: 'dec', name: t('soldDec') },
    { id: 11, key: 'sold', value: 'asc', name: t('soldAsc') },
    { id: 14, key: 'count', value: 'dec', name: t('countDec') },
    { id: 13, key: 'count', value: 'asc', name: t('countAsc') },
    { id: 16, key: 'view', value: 'dec', name: t('viewDec') },
    { id: 15, key: 'view', value: 'asc', name: t('viewAsc') }
  ])

  const showSort = ref(false)
  const openSort = () => {
    showSort.value = true
  }

  const closeSort = () => {
    showSort.value = false
  }

  const selectedSort = ref(sorts.value[0])
  const selectSort = (sort) => {
    selectedSort.value = sort

    closeSort()
    pushByParams()
  }

  const pageCount = ref(1)
  const params = reactive({
    page_size: 100,
    page: 1,
    search: '',
    sort_key: '',
    filter_key: '',
    filter_value: '',
    filter_name: ''
  })

  const loading = ref(false)
  const getProducts = async () => {
    try {
      loading.value = true
      products.value = []
      document?.querySelector('.main__body')?.scrollTo(0, 0)

      const verifyType = moderationTypes.value.find((type) => type.key === route.query.status)?.id

      const { last_page, data } = await GET_PRODUCTS({
        lang: 'all',
        page_size: params.page_size,
        page: params.page,
        search: params.search,
        verify: verifyType,
        [selectedSort.value.key]: selectedSort.value.value,
        [params.filter_key]: params.filter_value
      })

      products.value = data || []
      pageCount.value = last_page
      scrollTop()
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const getAll = () => {
    params.page = 1

    params.filter_key = ''
    params.filter_value = ''
    params.filter_name = ''
    pushByParams()
  }

  const selectedDeleteProductId = ref(null)
  const selectDeleteProduct = (id) => {
    selectedDeleteProductId.value = id
    showConfirmProductPopUp.value = true
  }

  const showConfirmProductPopUp = ref(false)
  const confirmSuccessProduct = () => {
    deleteProduct(selectedDeleteProductId.value)
    showConfirmProductPopUp.value = false
  }
  const confirmCancelProduct = () => {
    selectedDeleteProductId.value = null
    showConfirmProductPopUp.value = false
  }

  const deleteProduct = async (id) => {
    try {
      await DELETE_PRODUCT({ id: id })
      getProducts()
    } catch (error) {
      console.error(error)
    }
  }

  const selectProduct = (product) => {
    router.push(`/product-variant/${product.vid}`)
  }

  const scrollTop = () => {
    document.querySelector('.main').scrollTo(0, 0)
  }

  const createProduct = () => {
    router.push('/product/new')
  }
  const createProductMulti = () => {
    router.push('/product-multi/new')
  }
  const showSelectProductPopUp = ref(false)
  const openSelectProductPopUp = () => {
    showSelectProductPopUp.value = true
  }
  const closeSelectProductPopUp = () => {
    showSelectProductPopUp.value = false
  }

  const filters = ref([
    { id: 'ALL', name: t('all') },
    { id: 'CATEGORIES', name: t('category') },
    { id: 'TAGS', name: t('tags') },
    { id: 'STATUS', name: t('statuses') },
    { id: 'STOCK', name: t('inStock') },
    { id: 'MODERATION', name: t('moderation') }
  ])

  const showFilterPopUp = ref(false)
  const openFilterPopUp = () => {
    showFilterPopUp.value = true
  }
  const closeFilterPopUp = () => {
    showFilterPopUp.value = false
  }

  const selectedFilter = ref(filters.value[0])
  const selectFilter = (filter) => {
    selectedFilter.value = filter

    switch (filter.id) {
      case 'ALL':
        getAll()
        break
      case 'CATEGORIES':
        openFilterCategoriesPopUp()
        break
      case 'TAGS':
        openFilterTagsPopUp()
        break
      case 'STATUS':
        openFilterStatusesPopUp()
        break
      case 'STOCK':
        openFilterStockPopUp()
        break
      case 'MODERATION':
        openFilterModerationPopUp()
        break
    }
  }

  const searchInterval = ref(null)
  const searchProduct = (text) => {
    params.search = text

    clearTimeout(searchInterval.value)
    searchInterval.value = setTimeout(() => {
      products.value = []
      params.page = 1

      pushByParams()
    }, 500)
  }

  const updatePage = (newPage) => {
    params.page = newPage

    pushByParams()
  }

  const { categories, getCategories } = useCategories()

  const showFilterCategoriesPopUp = ref(false)
  const openFilterCategoriesPopUp = () => {
    showFilterCategoriesPopUp.value = true
    getCategories()
  }
  const closeFilterCategoriesPopUp = () => {
    showFilterCategoriesPopUp.value = false
  }

  const selectFilterCategory = (category) => {
    params.page = 1
    params.filter_key = 'categories'
    params.filter_value = category.id
    params.filter_name = category.name

    pushByParams()
  }

  const { tags, getTags } = useTags()

  const showFilterTagsPopUp = ref(false)
  const openFilterTagsPopUp = () => {
    showFilterTagsPopUp.value = true
    getTags()
  }
  const closeFilterTagsPopUp = () => {
    showFilterTagsPopUp.value = false
  }
  const selectFilterTag = (tag) => {
    params.page = 1
    params.filter_key = 'tag'
    params.filter_value = tag.id
    params.filter_name = tag.name

    pushByParams()
  }

  const statuses = ref([
    { id: 1, name: t('open') },
    { id: 0, name: t('close') }
  ])
  const showFilterStatusesPopUp = ref(false)
  const openFilterStatusesPopUp = () => {
    showFilterStatusesPopUp.value = true
  }
  const closeFilterStatusesPopUp = () => {
    showFilterStatusesPopUp.value = false
  }

  const selectFilterStatus = (status) => {
    params.page = 1
    params.filter_key = 'status'
    params.filter_value = status.id
    params.filter_name = status.name

    pushByParams()
  }

  const stock = ref([
    { id: 0, name: 'Нет' },
    { id: 1, name: 'Да' }
  ])

  const showFilterStockPopUp = ref(false)
  const openFilterStockPopUp = () => {
    showFilterStockPopUp.value = true
  }
  const closeFilterStockPopUp = () => {
    showFilterStockPopUp.value = false
  }
  const selectFilterStock = (stock) => {
    params.page = 1
    params.filter_key = 'filter_count_empty'
    params.filter_value = stock.id
    params.filter_name = stock.name

    pushByParams()
  }

  const moderationTypes = ref([
    { id: 0, key: 'under_review', name: t('statusUnderReview') },
    { id: 1, key: 'confirmed', name: t('statusConfirmed') },
    { id: 2, key: 'rejected', name: t('statusRejected') }
  ])

  const showFilterModerationPopUp = ref(false)
  const openFilterModerationPopUp = () => {
    showFilterModerationPopUp.value = true
  }
  const closeFilterModerationPopUp = () => {
    showFilterModerationPopUp.value = false
  }

  const selectFilterModerationType = (moderationType) => {
    params.page = 1
    params.filter_key = 'verify'
    params.filter_value = moderationType.id
    params.filter_name = moderationType.name

    pushByParams()
  }

  const productMore = ref([
    { id: 'EDIT', name: t('edit') },
    { id: 'DELETE', name: t('delete') }
  ])

  const showProductMorePopUp = ref(false)

  const selectedMoreProduct = ref(null)
  const openProductMorePopUp = (product) => {
    selectedMoreProduct.value = product

    showProductMorePopUp.value = true
  }
  const closeProductMorePopUp = () => {
    showProductMorePopUp.value = false

    selectedMoreProduct.value = null
  }

  const selectEditProduct = () => {
    if (selectedMoreProduct.value.option) {
      let optionParams = '?'
      optionParams += `main=${selectedMoreProduct.value.option[0].value.id}`
      if (selectedMoreProduct.value.option[1])
        optionParams += `&secondary=${selectedMoreProduct.value.option[1].value.id}`

      router.push(`/product-multi/${selectedMoreProduct.value.id}${optionParams}`)
    } else {
      router.push(`/product/${selectedMoreProduct.value.id}`)
    }
  }

  const selectProductMore = (more) => {
    if (more.id === 'EDIT') {
      selectEditProduct()
    }
    if (more.id === 'DELETE') {
      selectDeleteProduct(selectedMoreProduct.value.id)
    }
  }

  const pushByParams = () => {
    router.push({
      path: '/',
      query: {
        ...params,
        sort_key: selectedSort.value?.key || '',
        sort_value: selectedSort.value?.value || ''
      }
    })
  }

  const getDataByRouteFilter = () => {
    const query = route.query

    params.page_size = Number(query.page_size) || 100
    params.page = Number(query.page) || 1
    params.search = query.search || ''
    params.status = query.status || ''
    params.filter_key = query.filter_key || ''
    params.filter_value = query.filter_value || ''
    params.filter_name = query.filter_name || ''

    if (query.sort_key) {
      const findSort = sorts.value.find((sort) => sort.key === query.sort_key && sort.value === query.sort_value)
      findSort && selectSort(findSort)
    }

    if (query.filter_key) {
      params.filter_key = query.filter_key
      params.filter_value = Number(query.filter_value)
      params.filter_name = query.filter_name
    }

    getProducts()
  }

  watch(
    () => route.fullPath,
    () => {
      getDataByRouteFilter()
    },
    { immediate: true }
  )
</script>

<template>
  <div class="home">
    <div class="home__wrapper">
      <div class="home__header">
        <div class="home__header-search">
          <m-text-filed
            @updateValue="searchProduct"
            :value="params.search"
            prev-icon="search"
            :placeholder="t('search')"
          />
        </div>
        <div @click="openSelectProductPopUp" class="home__header-menu">
          <m-button prev-icon="add" />
        </div>
      </div>
      <home-shimmer v-if="loading" />
      <template v-else>
        <div class="home__head">
          <div class="home__title">{{ t('product') }}</div>
          <div class="home__header-filter">
            <m-button @click="openSort" prev-icon="sort" outline />
            <m-button @click="openFilterPopUp" prev-icon="filter" outline />
          </div>
        </div>
        <div class="home__statuses">
          <div class="status status_success status_outline">
            <p>{{ t('statusOpen') }}</p>
            <span>0</span>
          </div>
          <div class="status status_danger status_outline">
            <p>{{ t('statusClosed') }}</p>
            <span>0</span>
          </div>
        </div>
        <div class="home__statuses">
          <div class="status status_return">
            <p>{{ t('statusUnderReview') }}</p>
            <span>0</span>
          </div>
          <div class="status status_success">
            <p>{{ t('statusConfirmed') }}</p>
            <span>0</span>
          </div>
          <div class="status status_danger">
            <p>{{ t('statusRejected') }}</p>
            <span>0</span>
          </div>
        </div>
        <div class="home__products">
          <div v-for="product in products" class="home__product" :key="product.uuid">
            <mini-product @select="selectProduct(product)" @more="openProductMorePopUp(product)" :item="product" />
          </div>
        </div>
        <div class="home__pagination">
          <m-pagination @click-page="updatePage" v-model="params.page" :page-count="pageCount" />
        </div>
      </template>
    </div>
  </div>
  <div v-if="showSelectProductPopUp" class="select-product-type">
    <div class="select-product-type__wrapper">
      <div class="select-product-type__head">
        <div class="select-product-type__title">{{ t('selectProductType') }}</div>
        <button @click="closeSelectProductPopUp" class="select-product-type__close">
          <base-icon name="dismiss" />
        </button>
      </div>
      <div class="select-product-type__body">
        <button @click="createProduct" class="select-product-type__item">{{ t('single') }}</button>
        <button @click="createProductMulti" class="select-product-type__item">
          {{ t('productWithCharacteristics') }}
        </button>
      </div>
    </div>
  </div>
  <teleport to="#bot">
    <sort-bottom
      @select-item="selectSort"
      @close="closeSort"
      :show="showSort"
      :items="sorts"
      :selected-item="selectedSort"
    />
    <select-pop-up
      @close="closeFilterPopUp"
      @select-item="selectFilter"
      :items="filters"
      :title="t('filters')"
      v-if="showFilterPopUp"
    />
    <select-pop-up
      @close="closeFilterCategoriesPopUp"
      @select-item="selectFilterCategory"
      :items="categories"
      :title="t('category')"
      v-if="showFilterCategoriesPopUp"
    />
    <select-pop-up
      @close="closeFilterTagsPopUp"
      @select-item="selectFilterTag"
      :items="tags"
      :title="t('tags')"
      v-if="showFilterTagsPopUp"
    />
    <select-pop-up
      @close="closeFilterStatusesPopUp"
      @select-item="selectFilterStatus"
      :items="statuses"
      :title="t('statuses')"
      v-if="showFilterStatusesPopUp"
    />
    <select-pop-up
      @close="closeFilterStockPopUp"
      @select-item="selectFilterStock"
      :items="stock"
      :title="t('inStock')"
      v-if="showFilterStockPopUp"
    />
    <select-pop-up
      @close="closeFilterModerationPopUp"
      @select-item="selectFilterModerationType"
      :items="moderationTypes"
      :title="t('moderation')"
      v-if="showFilterModerationPopUp"
    />
    <select-pop-up
      @close="closeProductMorePopUp"
      @select-item="selectProductMore"
      :items="productMore"
      v-if="showProductMorePopUp"
      :title="t('actions')"
    />
    <pop-up-confirm-delete
      @confirm="confirmSuccessProduct"
      @cancel="confirmCancelProduct"
      v-if="showConfirmProductPopUp"
      :title="t('productRemoveText')"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .home {
    // .home__wrapper
    &__wrapper {
    }
    // .home__header
    &__header {
      display: flex;
      gap: 10px;
      position: sticky;
      top: 0px;
      z-index: 1;
      padding: 20px;
      background-color: var(--background);
      border-bottom: 1px solid var(--gray-300);
    }
    // .home__header-search
    &__header-search {
      flex: 1 1;
    }
    // .home__header-menu
    &__header-menu {
    }
    // .home__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px 0 20px;
    }
    // .home__header-filter
    &__header-filter {
      display: flex;
      gap: 10px;
    }
    // .home__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
    }
    // .home__statuses
    &__statuses {
      display: flex;
      padding: 10px 20px 0 20px;
      gap: 10px;
      .status {
        margin-left: 0;
      }
    }
    // .home__products
    &__products {
      padding: 10px 0 20px 0;
    }
    // .home__product
    &__product {
      padding: 0 20px;
      &._warning {
        background-color: var(--warning-100);
      }
      &._danger {
        background-color: var(--danger-100);
      }
    }
    // .home__pagination
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 30px;
    }
  }

  .select-product-type {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    z-index: 99;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    // .select-product-type__wrapper
    &__wrapper {
      background-color: var(--white);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      width: 100%;
      overflow: hidden;
    }
    // .select-product-type__head
    &__head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 14px;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-100);
    }

    // .select-product-type__title
    &__title {
      font-size: 16px;
      font-weight: 600;
    }
    // .select-product-type__close
    &__close {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      color: var(--danger-800);
      background-color: var(--danger-100);
      border: 1px solid var(--danger-300);
    }
    // .select-product-type__body
    &__body {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    // .select-product-type__item
    &__item {
      background-color: var(--green-500);
      border-radius: 8px;
      padding: 14px;
      color: var(--white);
      font-weight: 600;
      display: block;
      width: 100%;
    }
  }
</style>
