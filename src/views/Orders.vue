<script setup>
  import { ref, watch, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MTextFiled from '@/UI/MTextFiled.vue'
  import MPagination from '@/UI/MPagination.vue'
  import MDatepicker from '@/UI/MDatepicker.vue'
  import MButton from '@/UI/MButton.vue'
  import MImage from '@/UI/MImage.vue'
  import OrdersShimmer from '@/components/shimmers/OrdersShimmer.vue'
  import SortBottom from '@/components/SortBottom.vue'

  import { GET_SELLER_ORDERS } from '@/api/order.api'
  import { getDate } from '@/helpers/date'

  const { t } = useI18n()

  const router = useRouter()
  const route = useRoute()

  const filters = ref([
    { id: 'ALL', name: t('all') },
    { id: 'AC', name: t('accepted') },
    { id: 'CA', name: t('canceled') },
    { id: 'RE', name: t('returned') },
    { id: 'SE', name: t('sending') },
    { id: 'SU', name: t('success') }
  ])
  const statuses = ref([
    { id: 'AC', key: 'accepted', count: 0, name: t('accepted') },
    { id: 'CA', key: 'canceled', count: 0, name: t('canceled') },
    { id: 'RE', key: 'return', count: 0, name: t('returned') },
    { id: 'SE', key: 'sending', count: 0, name: t('sending') },
    { id: 'SU', key: 'success', count: 0, name: t('success') }
  ])

  const statusClasses = ref({
    AC: { key: 'accepted', class: 'status_accepted', name: t('accepted') },
    CA: { key: 'canceled', class: 'status_canceled', name: t('canceled') },
    RE: { key: 'return', class: 'status_return', name: t('returned') },
    SE: { key: 'sending', class: 'status_sending', name: t('sending') },
    SU: { key: 'success', class: 'status_success', name: t('success') }
  })

  const sorts = ref([
    { id: 1, key: 'created', value: 'dec', name: t('dateCreatedDec') },
    { id: 2, key: 'created', value: 'asc', name: t('dateCreatedAsc') }
  ])

  const selectedFilter = ref(filters.value[0])
  const selectFilter = (sort) => {
    selectedFilter.value = sort
    params.status = sort.id === 'ALL' ? '' : sort.id

    pushByParams()
    closeFilter()
  }

  const showFilter = ref(false)
  const openFilter = () => {
    showFilter.value = true
  }

  const closeFilter = () => {
    showFilter.value = false
  }

  const pageCount = ref(1)
  const params = reactive({
    page_size: 100,
    page: 1,
    search: '',
    start_date: '',
    end_date: '',
    status: '',
    created: ''
  })

  const loading = ref(true)
  const orders = ref([])
  const totalPrice = ref(0)

  const getOrders = async () => {
    try {
      loading.value = true
      orders.value = []
      document?.querySelector('.main__body')?.scrollTo(0, 0)

      const { data, last_page } = await GET_SELLER_ORDERS({
        params: {
          lang: 'all',
          ...params,
          [selectedSort.value.key]: selectedSort.value.value
        }
      })

      orders.value = data.order_list || []
      totalPrice.value = data.total_price
      pageCount.value = last_page

      statuses.value.forEach((status) => {
        status.count = data[status.id] || 0
      })
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }

  const selectedSort = ref(sorts.value[0])
  const selectSort = (sort) => {
    selectedSort.value = sort
    pushByParams()
    closeSort()
  }

  const showSort = ref(false)
  const openSort = () => {
    showSort.value = true
  }

  const closeSort = () => {
    showSort.value = false
  }

  const updatePage = (newPage) => {
    params.page = newPage
    pushByParams()
  }

  const searchInterval = ref(null)
  const searchOrder = (text) => {
    params.search = text
    clearTimeout(searchInterval.value)
    searchInterval.value = setTimeout(() => {
      orders.value = []
      params.page = 1
      pushByParams()
    }, 500)
  }

  const selectStartDate = (date) => {
    params.start_date = date
    params.page = 1

    pushByParams()
  }

  const selectEndDate = (date) => {
    params.end_date = date
    params.page = 1

    pushByParams()
  }

  const pushByParams = () => {
    router.push({
      path: '/orders',
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
    params.start_date = query.start_date || ''
    params.end_date = query.end_date || ''
    params.status = query.status || ''
    if (query.sort_key) {
      const findSort = sorts.value.find((sort) => sort.key === query.sort_key && sort.value === query.sort_value)
      findSort && selectSort(findSort)
    }

    getOrders()
  }

  watch(
    () => route.fullPath,
    () => {
      getDataByRouteFilter()
    },
    { immediate: true }
  )

  const getOptionName = (option) => {
    return [option.option?.name.ru, option.value?.name.ru].join(', ')
  }
</script>
<template>
  <div class="orders">
    <div class="orders__wrapper">
      <div class="orders__header">
        <div class="orders__header-search">
          <m-text-filed
            @updateValue="searchOrder"
            :value="params.search"
            prev-icon="search"
            :placeholder="t('search')"
          />
        </div>
        <div class="orders__header-date">
          <m-datepicker @selectDate="selectStartDate" v-model="params.start_date" />
        </div>
        <div class="orders__header-date">
          <m-datepicker @selectDate="selectEndDate" v-model="params.end_date" right />
        </div>
      </div>
      <orders-shimmer v-if="loading" />
      <template v-else>
        <div class="orders__head">
          <div class="orders__title">{{ t('orders') }}: {{ totalPrice }}</div>
          <div class="orders__filter">
            <m-button @click="openSort" prev-icon="sort" outline />
            <m-button @click="openFilter" prev-icon="filter" outline />
          </div>
        </div>
        <div class="orders__statues">
          <div v-for="status in statuses" :class="['status', `status_${status.key}`]">
            {{ status.name }}
            <span>{{ status.count }}</span>
          </div>
        </div>

        <div class="orders__orders">
          <div v-for="(order, index) in orders" class="orders__order">
            <div class="orders__main">
              <div class="orders__image">
                <m-image :image="order.variant?.image?.thumbnail" width="80px" height="80px" />
              </div>
              <div class="orders__product-info">
                <div class="orders__product-name">{{ order.variant?.name.ru }}</div>
                <div class="orders__product-code">{{ order.variant?.code }}</div>
              </div>
            </div>
            <div class="orders__content">
              <div class="orders__content-item">
                <p>№</p>
                <span>{{ (params.page - 1) * params.page_size + index + 1 }}</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('orderNumber') }}</p>
                <span>{{ order.order_code }}</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('date') }}</p>
                <span>{{ getDate(order.created_at) }}</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('price') }}</p>
                <span>{{ order.price || 0 }} TMT</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('count') }}</p>
                <span>{{ order.count }}</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('totalPrice') }}</p>
                <span>{{ order.total_price }} TMT</span>
              </div>
              <div class="orders__content-item">
                <p>{{ t('status') }}</p>
                <span>
                  <div v-if="order.status" :class="['status', statusClasses[order.status].class]">
                    {{ statusClasses[order.status].name }}
                  </div>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div class="orders__pagination">
          <m-pagination @click-page="updatePage" v-model="params.page" :page-count="pageCount" />
        </div>
      </template>
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
    <sort-bottom
      @select-item="selectFilter"
      @close="closeFilter"
      :show="showFilter"
      :items="filters"
      :selected-item="selectedFilter"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .orders {
    // .orders__wrapper
    &__wrapper {
    }
    // .orders__header
    &__header {
      display: flex;
      gap: 10px;
      padding: 20px;
      background-color: var(--background);
      border-bottom: 1px solid var(--gray-300);
      flex-wrap: wrap;
    }
    // .orders__header-search
    &__header-search {
      width: 100%;
    }
    // .orders__header-date
    &__header-date {
      flex: 1 1;
    }
    // .orders__header-menu
    &__header-menu {
    }
    // .orders__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
    }
    // .orders__filter
    &__filter {
      display: flex;
      gap: 10px;
    }
    // .orders__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 20px 0 20px;
    }
    // .orders__statues
    &__statues {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 20px 0 20px;
      .status {
        margin: 0;
      }
    }
    // .orders__orders
    &__orders {
      padding: 20px;
    }
    // .orders__order
    &__order {
      padding: 10px;
      border-radius: 8px;
      background-color: var(--gray-100);
      border: 1px solid var(--gray-300);
      margin-bottom: 10px;
    }
    // .orders__main
    &__main {
      display: flex;
      gap: 10px;
    }
    // .orders__image
    &__image {
    }
    // .orders__product-info
    &__product-info {
      flex: 1 1;
      width: 0;
    }
    // .orders__product-name
    &__product-name {
      font-size: 15px;
      line-height: 1.2;
      font-weight: 600;
      color: var(--gray-900);
    }
    // .orders__product-code
    &__product-code {
      font-weight: 300;
      margin-top: 6px;
      font-size: 13px;
    }

    // .orders__content
    &__content {
      margin-top: 20px;
    }
    // .orders__content-item
    &__content-item {
      display: flex;
      align-items: center;
      height: 30px;
      border-top: 0.5px solid var(--gray-200);
      p {
        font-weight: 600;
        flex: 1 1;
      }
      span {
        display: block;
        flex: 1 1;
        .status {
          margin-left: 0;
          padding: 5px 10px;
          margin-bottom: 0;
        }
      }
    }

    // .orders__pagination
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 30px;
    }
  }
</style>
