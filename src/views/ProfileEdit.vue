<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import { useAuth } from '@/store/auth'
  import BaseIcon from '@/UI/BaseIcon.vue'

  import MTextFiled from '@/UI/MTextFiled.vue'
  import MTextarea from '@/UI/MTextarea.vue'
  import MButton from '@/UI/MButton.vue'
  import MImageUploader from '@/UI/MImageUploader.vue'

  import { EDIT_PROFILE } from '@/api/auth.api'

  const { t } = useI18n()
  const router = useRouter()

  const auth = useAuth()

  const form = ref({
    market_name: '',
    name: '',
    number: '',
    email: '',
    description_tm: '',
    description_ru: '',
    fee: 0,
    address: '',
    logo: ''
  })

  form.value = {
    market_name: auth.getUser?.market_name,
    name: auth.getUser?.name,
    number: auth.getUser?.number,
    email: auth.getUser?.email,
    description_tm: auth.getUser?.description.tm,
    description_ru: auth.getUser?.description.ru,
    fee: auth.getUser?.fee,
    address: auth.getUser?.address,
    logo: '',
    status: 1
  }
  const prevImage = ref(auth.getUser?.logo)

  const loading = ref(false)
  const error = ref(false)

  const submitForm = async () => {
    try {
      const { status } = await EDIT_PROFILE({ data: form.value, id: auth.getUser?.id })
      if (status === 'error') {
        error.value = true
        return
      }
      if (status === 'success') {
        router.push('/profile')
      }
    } catch (err) {
      console.error(err)
      error.value = true
    }
  }

  const changeImage = (files) => {
    if (files?.length) {
      form.value.logo = files[0]
    }
  }

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
          <p>{{ t('profile') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="edit-profile">
          <div class="edit-profile__wrapper">
            <form @submit.prevent="submitForm" class="edit-profile__form">
              <div class="edit-profile__item">
                <div class="edit-profile__image">
                  <m-image-uploader @change-file="changeImage" :title="t('uploadPhoto')" :imagePath="prevImage" circle accept="image/*" />
                </div>
              </div>
              <div class="edit-profile__item">
                <m-text-filed v-model.trim="form.market_name" :error="error" :disabled="loading" :label="t('marketName')" />
              </div>
              <div class="edit-profile__item">
                <m-text-filed v-model.trim="form.name" :error="error" :disabled="loading" :label="t('name')" />
              </div>
              <div class="edit-profile__item">
                <m-text-filed v-model.trim="form.number" :error="error" :disabled="loading" :label="t('phoneNumber')" placeholder="+9936XXXXXXX" />
              </div>
              <div class="edit-profile__item">
                <m-text-filed v-model.trim="form.email" :error="error" :disabled="loading" :label="t('email')" />
              </div>
              <div class="edit-profile__item">
                <m-textarea v-model.trim="form.address" :error="error" :disabled="loading" :label="t('address')" />
              </div>
              <div class="edit-profile__item">
                <m-textarea v-model.trim="form.description_ru" :error="error" :disabled="loading" :label="t('descriptionRu')" />
              </div>
              <div class="edit-profile__item">
                <m-textarea v-model.trim="form.description_tm" :error="error" :disabled="loading" :label="t('descriptionTm')" />
              </div>
              <div class="edit-profile__item">
                <m-button :loading="loading" :disabled="loading" block :title="t('save')" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .edit-profile {
    width: 100%;
    // .edit-profile__wrapper
    &__wrapper {
      width: 100%;
      padding: 30px 20px;
      height: 100%;
    }
    // .edit-profile__form
    &__form {
    }
    // .edit-profile__item
    &__item {
      &:not(:first-child) {
        margin-top: 14px;
      }
    }
    // .edit-profile__image
    &__image {
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }
    // .edit-profile__other
    &__other {
      background-color: transparent;
      margin-top: 10px;
      width: 100%;
      display: flex;
      justify-content: flex-end;
      button {
        background-color: transparent;
        font-size: 14px;
        font-weight: 500;
        color: var(--gray-500);
      }
    }
  }
</style>
