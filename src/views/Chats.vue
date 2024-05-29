<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import MImage from '@/UI/MImage.vue'

  import { getDate } from '@/helpers/date'

  import { GET_ALL_ROOMS } from '@/api/chat.api'

  const router = useRouter()
  const { t } = useI18n()

  const limit = ref(25)
  const page = ref(1)
  const pages = ref(1)

  const rooms = ref([])
  const getAllRooms = async () => {
    try {
      const { data, last_page } = await GET_ALL_ROOMS({
        params: {
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

  const openChat = (chat) => {
    let params = '?'
    if (chat.client) {
      params += `user_name=${chat.client.name}&`
    }
    router.push(`/chat/${chat.id}${params}`)
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
  <div class="chats">
    <div class="chats__wrapper">
      <div class="chats__head-title">{{ t('chats') }}</div>
      <div class="chats__list">
        <div v-for="room in rooms" @click="openChat(room)" class="chats__item">
          <div class="chats__content">
            <div class="chats__info">
              <div class="chats__user">{{ room.client.name }}</div>
              <div class="chats__message">{{ room.last_message.message }}</div>
            </div>
            <div class="chats__time-count">
              <div class="chats__time">{{ getDate(room.created_at) }}</div>
              <div v-if="room.unread" class="chats__count">{{ room.unread }}</div>
            </div>
          </div>
        </div>
      </div>
      <div ref="observerChats"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .chats {
    height: 100%;
    // .chats__wrapper
    &__wrapper {
      height: 100%;
    }
    // .chats__head-title
    &__head-title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
      padding: 20px;
    }
    // .chats__list
    &__list {
    }
    // .chats__item
    &__item {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 20px;
      height: 72px;
    }
    // .chats__img
    &__img {
    }
    // .chats__content
    &__content {
      padding: 10px 0;
      flex: 1 1;
      display: flex;
      border-bottom: 1px solid var(--gray-200);
    }
    // .chats__info
    &__info {
      flex: 1 1;
      width: 0;
      padding-right: 10px;
    }
    // .chats__user
    &__user {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: #00030d;
    }
    // .chats__message
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
    // .chats__time-count
    &__time-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    // .chats__time
    &__time {
      font-weight: 300;
      font-size: 10px;
      line-height: 10px;
    }
    // .chats__count
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
