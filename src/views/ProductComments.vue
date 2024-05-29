<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import MImage from '@/UI/MImage.vue'
  import MButton from '@/UI/MButton.vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MPagination from '@/UI/MPagination.vue'

  import { getDate } from '@/helpers/date'
  import { GET_COMMENTS, DELETE_COMMENT } from '@/api/comments.api'

  const { t } = useI18n()
  const router = useRouter()

  const page = ref(1)
  const pages = ref(1)

  const ratingList = ref([
    { stars: 5, count: 0, percent: 0 },
    { stars: 4, count: 0, percent: 0 },
    { stars: 3, count: 0, percent: 0 },
    { stars: 2, count: 0, percent: 0 },
    { stars: 1, count: 0, percent: 0 }
  ])
  const commentsCount = ref(0)
  const starsAverage = ref(0)

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

      commentsCount.value = data.count
      let starsCount = 0
      for (let index = 0; index < 5; index++) {
        ratingList.value[index].count = data.stars[ratingList.value[index].stars]
        ratingList.value[index].percent = Math.round((data.stars[ratingList.value[index].stars] / commentsCount.value) * 100)
        starsCount += data.stars[ratingList.value[index].stars] * ratingList.value[index].stars
      }
      starsAverage.value = Math.round((starsCount / commentsCount.value) * 10) / 10 || 0
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

  const openComment = (id) => {
    router.push(`/comment/${id}`)
  }

  const back = () => {
    router.go(-1)
  }

  const updatePage = (p) => {
    page.value = p
    comments.value = []
    getComments()
  }
</script>

<template>
  <div class="menu _show">
    <div class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="back" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('comments') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="product-comments">
          <div class="product-comments__wrapper">
            <div class="product-comments__rating">
              <div class="rating">
                <div class="rating__wrapper">
                  <div class="rating__main">
                    <div class="rating__total-count">
                      <span>{{ starsAverage }}</span> {{ t('from') }} 5
                    </div>
                    <div class="rating__total-stars">
                      <base-icon :name="starsAverage >= 1 ? 'starFilled' : starsAverage > 0 ? 'starHalf' : 'star'" />
                      <base-icon :name="starsAverage >= 2 ? 'starFilled' : starsAverage > 1 ? 'starHalf' : 'star'" />
                      <base-icon :name="starsAverage >= 3 ? 'starFilled' : starsAverage > 2 ? 'starHalf' : 'star'" />
                      <base-icon :name="starsAverage >= 4 ? 'starFilled' : starsAverage > 3 ? 'starHalf' : 'star'" />
                      <base-icon :name="starsAverage === 5 ? 'starFilled' : starsAverage > 4 ? 'starHalf' : 'star'" />
                    </div>
                  </div>
                  <div class="rating__list">
                    <div v-for="rating in ratingList" class="rating__item">
                      <div class="rating__starts">
                        <base-icon v-for="index in rating.stars" name="starFilled" class="_active" />
                        <base-icon v-for="index in 5 - rating.stars" name="star" />
                      </div>
                      <div class="rating__percent">
                        <div class="rating__percent-line" :style="`--progress: ${rating.percent}%`"></div>
                        <div class="rating__percent-count">{{ rating.count }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="product-comments__body">
              <div v-for="comment in comments" class="product-comments__item">
                <div class="product-comments__user">
                  <div @click="openComment(comment.id)" class="product-comments__user-image">
                    <m-image width="40px" height="40px" circle />
                  </div>
                  <div @click="openComment(comment.id)" class="product-comments__user-name">USER NAME</div>
                  <div class="product-comments__delete">
                    <m-button @click="deleteComment(comment.id)" prev-icon="delete" theme="error" outline />
                  </div>
                </div>
                <div @click="openComment(comment.id)" class="product-comments__content">
                  <div class="product-comments__comment">{{ comment.message }}</div>
                  <div class="product-comments__starts">
                    <base-icon v-for="i in comment.ball" name="starFilled" />
                    <base-icon v-for="i in 5 - comment.ball" name="star" />
                  </div>
                  <div :class="['product-comments__status', { _success: !!comment.status, _danger: !comment.status }]">
                    {{ !!comment.status ? t('open') : t('close') }}
                  </div>
                  <div class="product-comments__date">{{ getDate(comment.created_at) }}</div>
                  <div class="product-comments__product-name">{{ comment.product }}</div>
                </div>
              </div>
              <div class="product-comments__pagination">
                <m-pagination @click-page="updatePage" v-model="page" :page-count="pages" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .menu__wrapper {
    overflow: auto;
  }
  .menu__body {
    height: auto;
    overflow: hidden;
    padding-top: 56px;
  }
  .menu__head {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }

  .product-comments {
    // .product-comments__wrapper
    &__wrapper {
      padding: 20px;
    }
    // .product-comments__body
    &__body {
      padding: 20px 0;
    }
    // .product-comments__item
    &__item {
      background-color: var(--gray-100);
      margin-bottom: 20px;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid var(--gray-300);
    }
    // .product-comments__user
    &__user {
      display: flex;
      align-items: center;
      gap: 10px;
      border-bottom: 1px solid var(--gray-300);
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    // .product-comments__user-image
    &__user-image {
    }
    // .product-comments__user-name
    &__user-name {
      flex: 1 1;
      width: 0;
      font-weight: 500;
      font-size: 15px;
    }
    // .product-comments__delete
    &__delete {
    }
    // .product-comments__comment
    &__comment {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 10px;
      margin-bottom: 10px;
      border-bottom: 1px solid var(--gray-300);
    }
    // .product-comments__starts
    &__starts {
      display: flex;
      color: var(--warning-600);
    }
    // .product-comments__status
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
    // .product-comments__date
    &__date {
      margin-top: 10px;
      color: var(--gray-600);
    }
    // .product-comments__product-name
    &__product-name {
      margin-top: 10px;
      color: var(--gray-900);
      font-weight: 500;
    }
    // .product-comments__rating
    &__rating {
      padding-bottom: 20px;
      border-bottom: 1px solid var(--gray-300);
    }
    // .product-comments__pagination
    &__pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      padding-bottom: 30px;
    }
  }

  .rating {
    // .rating__wrapper
    &__wrapper {
      background-color: var(--gray-100);
      border: 1px solid var(--gray-300);
      padding: 10px;
      border-radius: 8px;
    }
    // .rating__main
    &__main {
      width: 100%;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 20px;
      border-bottom: 1px solid var(--gray-300);
      padding-bottom: 10px;
    }
    // .rating__total-stars
    &__total-stars {
      color: var(--warning-600);
      display: flex;
    }
    // .rating__total-count
    &__total-count {
      font-size: 16px;
      color: var(--gray-600);
      span {
        font-weight: 700;
      }
    }
    // .rating__list
    &__list {
    }
    // .rating__item
    &__item {
      display: flex;
      align-items: center;
      gap: 10px;
      &:not(:first-child) {
        margin-top: 2px;
      }
    }
    // .rating__starts
    &__starts {
      display: flex;
      gap: 2px;
      color: var(--gray-600);
      ._active {
        color: var(--warning-600);
      }
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .rating__percent
    &__percent {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1 1;
      width: 0;
    }
    // .rating__percent-line
    &__percent-line {
      background-color: var(--gray-300);
      border-radius: 2px;
      height: 4px;
      position: relative;
      flex: 1 1;
      width: 0;
      &::before {
        content: '';
        display: block;
        height: 100%;
        border-radius: 2px;
        background-color: var(--success-600);
        width: var(--progress);
      }
    }
    // .rating__percent-count
    &__percent-count {
      color: var(--gray-900);
    }
  }
</style>
