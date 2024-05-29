<script setup>
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRoute, useRouter } from 'vue-router'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import MCheckbox from '@/UI/MCheckbox.vue'
  import MButton from '@/UI/MButton.vue'

  import { getDate } from '@/helpers/date'

  import { GET_COMMENT, EDIT_COMMENT, ADD_REPLY_COMMENT, EDIT_REPLY_COMMENT, DELETE_COMMENT } from '@/api/comments.api'

  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()

  const comment = ref({
    id: null,
    product: null,
    ball: 0,
    message: '',
    client: null,
    created_at: '',
    updated_at: '',
    status: 0,
    reply: null
  })

  const getComment = async () => {
    try {
      const { data } = await GET_COMMENT({ id: route.params.id })
      comment.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getComment()

  const updateComment = async () => {
    try {
      await EDIT_COMMENT({
        id: comment.value.id,
        data: {
          message: comment.value.message,
          ball: comment.value.ball,
          status: comment.value.status
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const deleteComment = async () => {
    try {
      await DELETE_COMMENT({ id: comment.value.id })
      back()
    } catch (error) {
      console.error(error)
    }
  }

  const replyText = ref('')
  const replyComment = async () => {
    try {
      const { data } = await ADD_REPLY_COMMENT({
        comment: comment.value.id,
        message: replyText.value
      })
      comment.value = data
      replyText.value = ''
    } catch (error) {
      console.error(error)
    }
  }

  const updateReplyComment = async () => {
    try {
      const { data } = await EDIT_REPLY_COMMENT({
        id: comment.value.id,
        data: {
          reply: comment.value.reply.id,
          message: replyText.value
        }
      })
      comment.value = data
      closeEditReply()
    } catch (error) {
      console.error(error)
    }
  }

  const updateStatus = (status) => {
    comment.value.status = status ? 1 : 0
    updateComment()
  }
  const showEditReply = ref(false)
  const openEditReply = () => {
    showEditReply.value = true
    replyText.value = comment.value.reply.message
  }
  const closeEditReply = () => {
    showEditReply.value = false
    replyText.value = ''
  }

  const back = () => {
    router.go(-1)
  }
</script>

<template>
  <div class="comment">
    <div class="comment__head">
      <button @click="back" class="comment__back">
        <base-icon name="chevronButton" />
        <p>{{ t('back') }}</p>
      </button>
    </div>
    <div class="comment__body">
      <div class="comment__texts">
        <div class="comment__income">
          <div class="comment__text">{{ comment.message }}</div>
          <div v-if="comment.created_at" class="comment__date">{{ getDate(comment.created_at) }}</div>
          <div class="comment__stars">
            <base-icon v-for="index in comment.ball" name="starFilled" />
            <base-icon v-for="index in 5 - comment.ball" name="star" />
          </div>
          <div class="comment__status">
            <m-checkbox @update-status="updateStatus" :value="!!comment.status" :title="t('status')" />
          </div>
        </div>
        <div v-if="comment.reply && !showEditReply" class="comment__answer">
          <div class="comment__text">{{ comment.reply.message }}</div>
          <div class="comment__date">{{ getDate(comment.reply.created_at) }}</div>
        </div>
      </div>
      <div v-if="showEditReply" class="comment__bot">
        <div class="comment__textarea">
          <textarea v-model="replyText" :placeholder="t('message')"></textarea>
        </div>
        <button @click="updateReplyComment" class="comment__button">
          <base-icon name="send" />
        </button>
      </div>

      <div v-if="comment.id && !comment.reply" class="comment__bot">
        <div class="comment__textarea">
          <textarea v-model="replyText" :placeholder="t('message')"></textarea>
        </div>
        <button @click="replyComment" class="comment__button">
          <base-icon name="send" />
        </button>
      </div>

      <div v-if="comment.reply && !showEditReply" class="comment__bot">
        <m-button @click="openEditReply" :title="t('editAnswer')" prev-icon="edit" block />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .comment {
    height: 100%;
    background-color: var(--gray-100);
    // .comment__head
    &__head {
      background-color: var(--white);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--gray-300);
      padding: 10px;
    }
    // .comment__back
    &__back {
      background-color: transparent;
      color: var(--gray-900);
      padding: 10px;
      display: flex;
      align-items: center;
      &:deep() {
        span {
          transform: rotate(90deg);
        }
      }
      p {
        padding-left: 10px;
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
      }
    }
    // .comment__delete
    &__delete {
    }
    // .comment__body
    &__body {
      height: calc(100% - 65px);
      display: flex;
      flex-direction: column;
    }
    // .comment__texts
    &__texts {
      height: 0;
      flex: 1 1;
      overflow-y: auto;
      padding: 20px 10px;
    }
    // .comment__income
    &__income {
      background-color: var(--white);
      max-width: 80%;
      padding: 8px 14px;
      border-radius: 6px 17px 17px 17px;
    }
    // .comment__text
    &__text {
      font-size: 15px;
      line-height: 17px;
      color: var(--gray-900);
      font-weight: 500;
    }
    // .comment__date
    &__date {
      font-size: 12px;
      color: var(--gray-600);
      line-height: 14px;
      margin-top: 6px;
    }
    // .comment__stars
    &__stars {
      display: flex;
      color: var(--warning-600);
      margin-top: 6px;
    }
    // .comment__status
    &__status {
      margin-top: 10px;
    }
    // .comment__answer
    &__answer {
      margin-top: 10px;
      max-width: 80%;
      margin-left: auto;
      padding: 8px 14px;
      background-color: var(--green-500);
      border-radius: 17px 6px 17px 17px;

      .comment__text {
        color: var(--white);
      }
      .comment__date {
        color: var(--gray-300);
      }
    }
    // .comment__bot
    &__bot {
      display: flex;
      background-color: var(--white);
      border-top: 1px solid var(--gray-300);
      position: relative;
      padding: 10px;
    }
    // .comment__textarea
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
    // .comment__button
    &__button {
      background-color: transparent;
      color: var(--green-500);
      padding: 8px;
    }
  }
</style>
