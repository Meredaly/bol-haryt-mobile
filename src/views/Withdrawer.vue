<script setup>
  import { ref, watch, reactive } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MDatepicker from '@/UI/MDatepicker.vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MButton from '@/UI/MButton.vue'
  import SortBottom from '@/components/SortBottom.vue'
  import MPagination from '@/UI/MPagination.vue'

  import { GET_WITHDRAWALS } from '@/api/withdrawer.api'

  import { getDate } from '@/helpers/date'

  const router = useRouter()
  const route = useRoute()
  const { t } = useI18n()

  const pageCount = ref(1)
  const params = reactive({
    page_size: 100,
    page: 1,
    start_date: '',
    end_date: '',
    time: ''
  })

  const withdrawals = ref([])
  const getWithdrawals = async () => {
    try {
      const { data, last_page } = await GET_WITHDRAWALS({
        params: params
      })

      withdrawals.value = data || []

      pageCount.value = last_page
    } catch (error) {
      console.error(error)
    }
  }

  const sorts = ref([
    { id: 1, key: 'time', value: 'dec', name: t('dateCreatedDec') },
    { id: 2, key: 'time', value: 'asc', name: t('dateCreatedAsc') }
  ])

  const selectedSort = ref(sorts.value[0])
  const selectSort = (sort) => {
    selectedSort.value = sort

    params.time = sort.value

    closeSort()
    pushByParams()
  }

  const showSort = ref(false)
  const openSort = () => {
    showSort.value = true
  }

  const closeSort = () => {
    showSort.value = false
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

  const updatePage = (newPage) => {
    params.page = newPage
    pushByParams()
  }

  const pushByParams = () => {
    router.push({
      path: '/withdrawer',
      query: params
    })
  }

  const getDataByRouteFilter = () => {
    const query = route.query

    params.page_size = Number(query.page_size) || 100
    params.page = Number(query.page) || 1
    params.start_date = query.start_date || ''
    params.end_date = query.end_date || ''

    if (query.time) {
      const findSort = sorts.value.find((sort) => sort.value === query.time)
      findSort && selectSort(findSort)
    }

    getWithdrawals()
  }

  watch(
    () => route.fullPath,
    () => {
      getDataByRouteFilter()
    },
    { immediate: true }
  )

  const back = () => {
    router.push('/profile')
  }
</script>

<template>
  <div class="menu _show">
    <div class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="back" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('back') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="withdrawer">
          <div class="withdrawer__head">
            <div class="withdrawer__title">{{ t('removal') }}</div>
            <div class="withdrawer__sort">
              <m-button @click="openSort" prev-icon="sort" outline />
            </div>
          </div>
          <div class="withdrawer__dates">
            <div class="withdrawer__date">
              <m-datepicker @selectDate="selectStartDate" v-model="params.start_date" />
            </div>
            <div class="withdrawer__date">
              <m-datepicker @selectDate="selectEndDate" v-model="params.end_date" right />
            </div>
          </div>
          <div class="withdrawer__body">
            <div v-for="(withdrawer, index) in withdrawals" class="withdrawer__item">
              <div class="withdrawer__element">
                <p>№</p>
                <span>{{ (params.page - 1) * params.page_size + index + 1 }}</span>
              </div>
              <div class="withdrawer__element">
                <p>{{ t('paid') }}</p>
                <span>{{ withdrawer.paid }} TMT</span>
              </div>
              <div class="withdrawer__element">
                <p>{{ t('date') }}</p>
                <span>{{ getDate(withdrawer.time) }}</span>
              </div>
            </div>
          </div>
          <div class="withdrawer__pagination">
            <m-pagination @click-page="updatePage" v-model="params.page" :page-count="pageCount" />
          </div>
        </div>
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
  </teleport>
</template>

<style lang="scss" scoped>
  .withdrawer {
    padding: 20px 0;
    // .withdrawer__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 16px;
    }
    // .withdrawer__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
    }
    // .withdrawer__sort
    &__sort {
    }
    // .withdrawer__dates
    &__dates {
      display: flex;
      gap: 20px;
      padding: 20px 16px;
      border-bottom: 1px solid var(--gray-300);
    }
    // .withdrawer__date
    &__date {
      flex: 1 1;
    }
    // .withdrawer__body
    &__body {
      padding: 16px;
    }
    // .withdrawer__item
    &__item {
      padding: 0 16px;
      border: 1px solid var(--gray-300);
      background-color: var(--gray-100);
      border-radius: 10px;
      margin-bottom: 10px;
    }
    // .withdrawer__element
    &__element {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 7px 0;
      &:not(:first-child) {
        border-top: 1px solid var(--gray-200);
      }
      p {
        font-size: 13px;
        font-weight: 300;
      }
      span {
        font-weight: 500;
      }
    }
    // .withdrawer__pagination
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
