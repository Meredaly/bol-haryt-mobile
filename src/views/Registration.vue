<script setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MTextFiled from '@/UI/MTextFiled.vue'
  import MTextarea from '@/UI/MTextarea.vue'
  import MButton from '@/UI/MButton.vue'
  import MImageUploader from '@/UI/MImageUploader.vue'

  import { REGISTRATION } from '@/api/auth.api'

  const router = useRouter()
  const { t } = useI18n()

  const form = ref({
    market_name: '',
    name: '',
    number: '',
    email: '',
    description_tm: '',
    description_ru: '',
    fee: 0,
    address: '',
    logo: '',
    status: 1
  })

  const loading = ref(false)
  const error = ref(false)

  const submitForm = async () => {
    try {
      const { status } = await REGISTRATION({ data: form.value })
      if (status === 'error') {
        error.value = true
        return
      }
      if (status === 'success') {
        router.push('/login')
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

  const signIn = () => {
    router.push('/login')
  }
</script>

<template>
  <div class="registration">
    <div class="registration__wrapper">
      <div class="registration__title">Bol haryt</div>
      <form @submit.prevent="submitForm" class="registration__form">
        <div class="registration__item">
          <div class="registration__image">
            <m-image-uploader @change-file="changeImage" :title="t('uploadPhoto')" circle accept="image/*" />
          </div>
        </div>
        <div class="registration__item">
          <m-text-filed v-model.trim="form.market_name" :error="error" :disabled="loading" :label="t('marketName')" />
        </div>
        <div class="registration__item">
          <m-text-filed v-model.trim="form.name" :error="error" :disabled="loading" :label="t('name')" />
        </div>
        <div class="registration__item">
          <m-text-filed
            v-model.trim="form.number"
            :error="error"
            :disabled="loading"
            :label="t('phoneNumber')"
            placeholder="+9936XXXXXXX"
          />
        </div>
        <div class="registration__item">
          <m-text-filed v-model.trim="form.email" :error="error" :disabled="loading" :label="t('email')" />
        </div>
        <div class="registration__item">
          <m-textarea v-model.trim="form.address" :error="error" :disabled="loading" :label="t('address')" />
        </div>
        <div class="registration__item">
          <m-textarea
            v-model.trim="form.description_ru"
            :error="error"
            :disabled="loading"
            :label="t('descriptionRu')"
          />
        </div>
        <div class="registration__item">
          <m-textarea
            v-model.trim="form.description_tm"
            :error="error"
            :disabled="loading"
            :label="t('descriptionTm')"
          />
        </div>
        <div class="registration__item">
          <m-button :loading="loading" :disabled="loading" block :title="t('registration')" />
        </div>
      </form>
      <div class="registration__other">
        <button @click="signIn">{{ t('signIn') }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .registration {
    width: 100%;
    // .registration__wrapper
    &__wrapper {
      width: 100%;
      padding: 30px 20px;
      height: 100%;
    }
    // .registration__title
    &__title {
      font-size: 34px;
      line-height: 1.2;
      font-weight: 600;
      color: var(--gray-500);
      p {
        font-size: 40px;
        font-weight: 600;
        color: var(--gray-900);
      }
      img {
        margin-top: 10px;
        height: 50px;
        display: block;
      }
    }
    // .registration__form
    &__form {
      margin-top: 30px;
    }
    // .registration__item
    &__item {
      &:not(:first-child) {
        margin-top: 14px;
      }
    }
    // .registration__image
    &__image {
      width: 200px;
      height: 200px;
      margin: 0 auto;
    }
    // .registration__other
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
