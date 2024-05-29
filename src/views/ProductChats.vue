<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import BaseIcon from '@/UI/BaseIcon.vue'

  import { getDate } from '@/helpers/date'

  import { GET_ALL_ROOMS } from '@/api/chat.api'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const limit = ref(25)
  const page = ref(1)
  const pages = ref(1)

  const rooms = ref([])
  const getAllRooms = async () => {
    try {
      const { data, last_page } = await GET_ALL_ROOMS({
        params: {
          product: route.params.id,
          page_size: limit.value,
          page: page.value
        }
      })
      rooms.value = [...rooms.value, ...data]
      pages.value = last_page
    } catch (error) {
      console.error(error)
    }
  }

  getAllRooms()

  const openChat = (id) => {
    router.push(`/chat/${id}`)
  }

  const back = () => {
    router.go(-1)
  }

  const observer = ref(null)
  const observerChats = ref(null)

  onMounted(() => {
    const options = {}
    observer.value = new IntersectionObserver(async ([entry]) => {
      if (entry && entry.isIntersecting) {
        if (page.value < pages.value) {
          page.value = page.value + 1
          getAllRooms()
        }
      }
    }, options)

    observer.value.observe(observerChats.value)
  })

  onUnmounted(() => {
    observer.value.disconnect()
  })
</script>

<template>
  <div class="menu _show">
    <div class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="back" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('chats') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="product-chats">
          <div class="product-chats__wrapper">
            <div class="product-chats__list">
              <div v-for="room in rooms" @click="openChat(room.id)" :key="room.id" class="product-chats__item">
                <div class="product-chats__content">
                  <div class="product-chats__info">
                    <div class="product-chats__user">{{ room.client.name }}</div>
                    <div class="product-chats__message">{{ room.last_message.message }}</div>
                  </div>
                  <div class="product-chats__time-count">
                    <div class="product-chats__time">{{ getDate(room.created_at) }}</div>
                    <div v-if="room.unread" class="product-chats__count">{{ room.unread }}</div>
                  </div>
                </div>
              </div>
            </div>
            <div ref="observerChats"></div>
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
  .product-chats {
    // .product-chats__wrapper
    &__wrapper {
    }
    // .product-chats__head-title
    &__head-title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
      padding: 20px;
    }
    // .product-chats__list
    &__list {
    }
    // .product-chats__item
    &__item {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 20px;
      height: 72px;
    }
    // .product-chats__img
    &__img {
    }
    // .product-chats__content
    &__content {
      padding: 10px 0;
      flex: 1 1;
      display: flex;
      border-bottom: 1px solid var(--gray-200);
    }
    // .product-chats__info
    &__info {
      flex: 1 1;
      width: 0;
      padding-right: 10px;
    }
    // .product-chats__user
    &__user {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: #00030d;
    }
    // .product-chats__message
    &__message {
      font-weight: 400;
      font-size: 12px;
      line-height: 14px;
      color: #a0a4af;
      margin-top: 4px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    // .product-chats__time-count
    &__time-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    // .product-chats__time
    &__time {
      font-weight: 300;
      font-size: 10px;
      line-height: 10px;
    }
    // .product-chats__product
    &__product {
      padding-right: 10px;
    }
    // .product-chats__count
    &__count {
      font-weight: 700;
      font-size: 12px;
      line-height: 14px;
      color: var(--white);
      background-color: var(--success-600);
      width: fit-content;
      margin-top: 4px;
      padding: 6px;
      border-radius: 50px;
      height: 26px;
      min-width: 26px;
      text-align: center;
    }
  }
</style>
