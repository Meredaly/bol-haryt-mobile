<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import MImage from '@/UI/MImage.vue'
  import MButton from '@/UI/MButton.vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MPagination from '@/UI/MPagination.vue'
  import SortBottom from '@/components/SortBottom.vue'

  import { getDate } from '@/helpers/date'
  import { GET_COMMENTS, DELETE_COMMENT } from '@/api/comments.api'

  const router = useRouter()
  const { t } = useI18n()

  const page = ref(1)
  const pages = ref(1)

  const comments = ref([])

  const getComments = async () => {
    try {
      const { data } = await GET_COMMENTS({
        params: {
          page_size: 25,
          page: page.value
        }
      })
      comments.value = data?.comments || []
      pages.value = data?.last_page || 1
    } catch (error) {
      console.error(error)
    }
  }
  getComments()

  const deleteComment = async (id) => {
    try {
      await DELETE_COMMENT({ id: id })
      getComments()
    } catch (error) {
      console.error(error)
    }
  }

  const updatePage = (p) => {
    page.value = p
    comments.value = []
    getComments()
  }

  const openComment = (id) => {
    router.push(`/comment/${id}`)
  }

  const filterItems = ref([
    { id: 1, name: 'Artyan' },
    { id: 2, name: 'Kemelya' },
    { id: 3, name: 'A dan Z' },
    { id: 4, name: 'Z dan A' }
  ])
  const showFIlters = ref(false)
  const openFilter = () => {
    showFIlters.value = true
  }

  const closeFilter = () => {
    showFIlters.value = false
  }

  const selectedFilter = ref(null)
  const selectFilter = (filter) => {
    selectedFilter.value = filter

    closeFilter()
  }
</script>

<template>
  <div class="comments">
    <div class="comments__wrapper">
      <div class="comments__head">
        <div class="comments__title">{{ t('comments') }}</div>
        <div class="comments__filter"></div>
      </div>

      <div class="comments__body">
        <div v-for="comment in comments" @click="openComment(comment.id)" class="comments__item">
          <div class="comments__product">
            <m-image :image="comment.product.image" width="40px" height="40px" />
            <p>{{ comment.product.name }}</p>
          </div>
          <div class="comments__comment">{{ comment.message }}</div>
          <div class="comments__date">{{ getDate(comment.created_at) }}</div>
          <div class="comments__star-status">
            <div class="comments__starts">
              <base-icon v-for="i in comment.ball" name="starFilled" />
              <base-icon v-for="i in 5 - comment.ball" name="star" />
            </div>
            <div :class="['comments__status', { _success: !!comment.status, _danger: !comment.status }]">
              {{ !!comment.status ? 'Открыть' : 'Закрыть' }}
            </div>
          </div>
          <div class="comments__user">
            <p>Пользователь:</p>
            <span>{{ comment?.client?.name }}</span>
          </div>
        </div>
      </div>
      <div class="comments__pagination">
        <m-pagination @click-page="updatePage" v-model="page" :page-count="pages" />
      </div>
    </div>
  </div>
  <teleport to="#bot">
    <sort-bottom
      @select-item="selectFilter"
      @close="closeFilter"
      :show="showFIlters"
      :items="filterItems"
      :selected-item="selectedFilter"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .comments {
    // .comments__wrapper
    &__wrapper {
    }
    // .comments__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px;
    }
    // .comments__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
    }
    // .comments__body
    &__body {
      padding: 0 20px;
    }
    // .comments__item
    &__item {
      background-color: var(--gray-100);
      margin-bottom: 20px;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--gray-300);
    }
    // .comments__user
    &__user {
      display: flex;
      align-items: center;
      gap: 10px;
      border-top: 1px solid var(--gray-300);
      padding-top: 10px;
      margin-top: 10px;
      p {
        font-weight: 300;
      }
      span {
        font-weight: 600;
      }
    }
    // .comments__delete
    &__delete {
    }
    // .comments__comment
    &__comment {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
    }
    // .comments__star-status
    &__star-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    // .comments__starts
    &__starts {
      display: flex;
      color: var(--warning-600);
    }
    // .comments__status
    &__status {
      border: 1px solid var(--gray-300);
      background-color: var(--gray-100);
      color: var(--gray-800);
      font-size: 14px;
      width: fit-content;
      border-radius: 100px;
      padding: 4px 10px;
      margin-top: 4px;
      &._success {
        background-color: var(--success-100);
        border-color: var(--success-300);
        color: var(--success-800);
      }
      &._danger {
        background-color: var(--danger-100);
        border-color: var(--danger-300);
        color: var(--danger-800);
      }
    }
    // .comments__date
    &__date {
      margin-left: auto;
      width: fit-content;
      color: var(--gray-600);
      margin-bottom: 10px;
    }
    // .comments__product
    &__product {
      display: flex;
      align-items: center;
      gap: 10px;
      color: var(--gray-900);
      font-weight: 500;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--gray-300);
    }
    // .comments__pagination
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 30px;
    }
  }
</style>
