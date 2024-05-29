<script setup>
  import { ref, onMounted, onUnmounted, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import BaseIcon from '@/UI/BaseIcon.vue'

  import { getDate } from '@/helpers/date'

  import { GET_ROOM_MESSAGES, SEND_MESSAGE } from '@/api/chat.api'

  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()

  const limit = ref(20)
  const page = ref(1)
  const pages = ref(1)

  const messages = ref([])

  const loading = ref(false)

  const username = ref(route.query.user_name || '')
  const productData = ref(null)
  const getRoomMessages = async () => {
    try {
      loading.value = true
      let { data, last_page, product } = await GET_ROOM_MESSAGES({
        params: {
          id: route.params.id,
          page_size: limit.value,
          page: page.value
        }
      })
      productData.value = product
      data = data.reverse().map((message) => {
        return {
          id: message.id,
          text: message.message,
          date: getDate(message.created_at),
          position: message.client ? 'LEFT' : 'RIGHT'
        }
      })

      if (page.value === 1) {
        scrollToEnd()
      } else {
        scrollToId(data[data.length - 1].id)
      }
      messages.value = [...data, ...messages.value]
      pages.value = last_page
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  }
  getRoomMessages()

  const updateRoomMessages = async () => {
    try {
      let { data } = await GET_ROOM_MESSAGES({
        params: {
          id: route.params.id,
          page_size: 1,
          page: 1
        }
      })
      if (!data.length) return
      if (data[0].id !== messages.value[messages.value.length - 1].id) {
        updateCurrentMessages()
      }
    } catch (error) {
      console.error(error)
    }
  }

  const newMessagesCount = ref(0)
  const updateCurrentMessages = async (newMessages = [], page = 1) => {
    try {
      let { data, last_page } = await GET_ROOM_MESSAGES({
        params: {
          id: route.params.id,
          page_size: 20,
          page: page
        }
      })
      newMessages = [...data.reverse(), ...newMessages]
      const lastMessage = messages.value[messages.value.length - 1]

      const toLastIndex = newMessages.findIndex((message) => {
        return lastMessage.id === message.id
      })
      if (toLastIndex >= 0) {
        for (let index = toLastIndex + 1; index < newMessages.length; index++) {
          messages.value.push({
            id: newMessages[index].id,
            text: newMessages[index].message,
            date: getDate(newMessages[index].created_at),
            position: newMessages[index].client ? 'LEFT' : 'RIGHT'
          })
          newMessagesCount.value += 1
        }
        return
      }
      if (last_page > page) updateCurrentMessages(newMessages, page + 1)
    } catch (error) {
      console.log(error)
    }
  }

  const updateMessageInterval = ref(null)
  updateMessageInterval.value = setInterval(() => {
    updateRoomMessages()
  }, 3000)

  onUnmounted(() => {
    clearInterval(updateMessageInterval.value)
  })

  const message = ref('')
  const sendMessage = async () => {
    try {
      const { data } = await SEND_MESSAGE({
        data: { message: message.value, room: route.params.id }
      })
      message.value = ''
      messages.value.push({
        id: data.last_message.id,
        text: data.last_message.message,
        date: getDate(data.created_at),
        position: 'RIGHT'
      })
      scrollToEnd()
    } catch (error) {
      console.error(error)
    }
  }

  const scrollToBot = () => {
    chatList.value.scrollTo({
      left: 0,
      top: chatList.value.scrollHeight,
      behavior: 'smooth'
    })
    newMessagesCount.value = 0
  }

  const back = () => {
    router.go(-1)
  }

  const showScrollBottom = ref(false)
  const chatList = ref(null)
  onMounted(() => {
    scrollToEnd()
    chatList.value.addEventListener(
      'scroll',
      () => {
        if (chatList.value.scrollTop < 100 && page.value < pages.value && !loading.value) {
          page.value = page.value + 1
          getRoomMessages()
        }
        if (chatList.value.scrollHeight - (chatList.value.scrollTop + chatList.value.clientHeight) < 20) {
          newMessagesCount.value = 0
        }
        if (chatList.value.scrollTop + chatList.value.clientHeight < chatList.value.scrollHeight - 100) {
          showScrollBottom.value = true
        } else {
          showScrollBottom.value = false
        }
      },
      { passive: true }
    )
  })

  const scrollToId = (id) => {
    setTimeout(() => {
      const height = document.getElementById(id.toString()).offsetTop
      chatList.value.scrollTo(0, height)
    }, 0)
  }

  const scrollToEnd = () => {
    if (chatList.value) {
      setTimeout(() => {
        const height = chatList.value.scrollHeight
        chatList.value.scrollTo(0, height)
      }, 0)
    }
  }
</script>

<template>
  <div class="chat">
    <div class="chat__head">
      <button @click="back" class="chat__back">
        <base-icon name="chevronButton" />
      </button>
      <div class="chat__user">
        <div class="chat__username">{{ username }}</div>
        <div v-if="productData" class="chat__product-name">{{ productData.name }}</div>
      </div>
    </div>
    <div class="chat__body">
      <button @click="scrollToBot" v-if="showScrollBottom" class="chat__new-messages">
        <base-icon name="chevronLeft" />
        <div v-if="newMessagesCount">{{ newMessagesCount }}</div>
      </button>
      <div class="chat__chat-list" ref="chatList">
        <div class="chat-list">
          <div class="chat-list__items">
            <div
              v-for="message in messages"
              :key="message.id"
              :id="message.id"
              :class="[
                'chat-list__item',
                {
                  'chat-list__item_left': message.position === 'LEFT',
                  'chat-list__item_right': message.position === 'RIGHT'
                }
              ]"
            >
              <div class="chat-list__message">
                <div class="chat-list__text">
                  {{ message.text }}
                  <span class="chat-list__dummy-date">{{ message.date }}</span>
                </div>
                <div class="chat-list__date">{{ message.date }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat__message-area">
        <div class="message-area">
          <div class="message-area__textarea">
            <textarea v-model="message" :placeholder="t('message')"></textarea>
          </div>
          <button @click="sendMessage" class="message-area__button">
            <base-icon name="send" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .chat {
    height: 100%;
    background-color: var(--gray-100);
    // .chat__head
    &__head {
      background-color: var(--white);
      display: flex;
      border-bottom: 1px solid var(--gray-300);
      padding: 10px;
    }
    // .chat__back
    &__back {
      background-color: transparent;
      transform: rotate(90deg);
      color: var(--gray-600);
      padding: 10px;
    }
    // .chat__user
    &__user {
      display: flex;
      gap: 10px;
      flex: 1 1;
      align-items: center;
    }

    // .chat__user-image
    &__user-image {
    }
    // .chat__username
    &__username {
      font-size: 16px;
      font-weight: 500;
    }
    // /chat__product-name
    &__product-name {
      font-size: 14px;
      font-weight: 400;
    }
    // .chat__product
    &__product {
    }
    // .chat__body
    &__body {
      height: calc(100% - 65px);
      display: flex;
      flex-direction: column;
    }
    // .chat__new-messages
    &__new-messages {
      position: absolute;
      z-index: 3;
      width: 40px;
      height: 40px;
      background-color: var(--white);
      box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      bottom: 80px;
      right: 20px;
      span {
        transform: rotate(-90deg);
      }
      div {
        position: absolute;
        background-color: var(--primary-600);
        color: var(--white);
        border-radius: 20px;
        line-height: 20px;
        min-width: 20px;
        bottom: 0;
        right: 0;
        z-index: 1;
      }
    }
    // .chat__chat-list
    &__chat-list {
      height: 0;
      flex: 1 1;
      overflow-y: auto;
    }
    // .chat__message-area
    &__message-area {
    }
  }
  .chat-list {
    // .chat-list__items
    &__items {
      padding: 20px 10px;
    }
    // .chat-list__item
    &__item {
      max-width: 80%;
      &:not(:first-child) {
        margin-top: 10px;
      }
      // .chat-list__item_left
      &_left {
      }
      // .chat-list__item_right
      &_right {
        margin-left: auto;
        .chat-list__message {
          background-color: var(--success-600);
          border-radius: 17px 6px 6px 17px;
          margin-right: 0;
          margin-left: auto;
        }
        .chat-list__text {
          color: var(--white);
        }
        .chat-list__date {
          color: var(--gray-300);
        }
      }
    }
    .chat-list__item_left + .chat-list__item_left {
      margin-top: 4px;
    }

    .chat-list__item_right + .chat-list__item_right {
      margin-top: 4px;
    }
    // .chat-list__message
    &__message {
      background-color: var(--white);
      padding: 8px 14px;
      border-radius: 6px 17px 17px 6px;
      -ms-box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      max-width: 100%;
      position: relative;
      text-align: left;
      -moz-user-select: none;
      -webkit-user-select: none;
      -o-user-select: none;
      -ms-user-select: none;
      user-select: none;
      vertical-align: top;
      white-space: normal;
      width: fit-content;
      word-break: break-word;
      margin-right: auto;
    }
    // .chat-list__text
    &__text {
      font-size: 15px;
      line-height: 17px;
      color: var(--gray-900);
    }
    // .chat-list__dummy-date
    &__dummy-date {
      -moz-box-orient: vertical;
      display: -moz-inline-box;
      display: inline-block;
      font-size: 12px;
      padding-left: 10px;
      vertical-align: middle;
      visibility: hidden;
      white-space: nowrap;
    }
    // .chat-list__date
    &__date {
      bottom: 10px;
      font-size: 12px;
      left: auto;
      line-height: 12px;
      position: absolute;
      right: 10px;
      top: auto;
      transition: opacity 0.3s;
      -moz-transition: opacity 0.3s;
      -o-transition: opacity 0.3s;
      -webkit-transition: opacity 0.3s;
      -moz-user-select: none;
      -webkit-user-select: none;
      -o-user-select: none;
      -ms-user-select: none;
      user-select: none;
      white-space: nowrap;
      color: #a0a0a0;
    }
  }
  .message-area {
    display: flex;
    background-color: var(--white);
    border-top: 1px solid var(--gray-300);
    position: relative;
    padding: 10px;
    // .message-area__textarea
    &__textarea {
      width: 100%;
      textarea {
        width: 100%;
        resize: none;
        font-weight: 400;
        font-size: 16px;
        line-height: 20px;
        height: 40px;
        padding: 8px 14px;
        background-color: var(--gray-100);
        border-radius: 50px;
        &::placeholder {
          font-size: 16px;
          line-height: 20px;
          color: var(--gray-600);
        }
      }
    }
    // .message-area__button
    &__button {
      background-color: transparent;
      color: var(--success-600);
      padding: 8px;
    }
  }
</style>
