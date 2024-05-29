<script setup>
  import { ref, reactive } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MTextFiled from '@/UI/MTextFiled.vue'
  import MButton from '@/UI/MButton.vue'

  import { AUTH } from '@/api/auth.api'

  const { cookies } = useCookies()
  const { t } = useI18n()
  const router = useRouter()

  const phoneNumber = ref('')
  const otpNumber = ref('')

  const formError = ref(false)

  const loading = ref(false)
  const error = ref(false)

  const sendMail = async () => {
    try {
      loading.value = true
      const { status } = await AUTH({ number: phoneNumber.value })

      if (status === 'error') {
        error.value = true
        return
      }
      showCode.value = true
      error.value = false
    } catch (err) {
      console.error(err)
      error.value = true
    } finally {
      loading.value = false
    }
  }

  const showCode = ref(false)
  const sendOtpCode = async () => {
    try {
      loading.value = true
      const { token, status } = await AUTH({
        number: phoneNumber.value,
        otp: otpNumber.value
      })

      if (status === 'error') {
        error.value = true
        loading.value = false
        return
      }
      cookies.set('Authorization', token, 100000000)
      router.push('/')
    } catch (err) {
      console.error(err)
      error.value = true
      loading.value = false
    }
  }
  cookies.remove('Authorization')

  const registration = () => {
    router.push('/registration')
  }
</script>

<template>
  <div class="login">
    <div class="login__wrapper">
      <div class="login__title">Bol haryt</div>
      <form v-if="!showCode" @submit.prevent="sendMail" class="login__form">
        <div class="login__item">
          <m-text-filed v-model.trim="phoneNumber" :label="t('phoneNumber')" :error="error" :disabled="loading" />
        </div>
        <div class="login__item">
          <m-button :title="t('continue')" block :loading="loading" :disabled="loading" />
        </div>
      </form>
      <form v-if="showCode" @submit.prevent="sendOtpCode" class="login__form">
        <div class="login__item">
          <m-text-filed v-model.trim="otpNumber" :label="t('kod')" :error="error" :disabled="loading" />
        </div>
        <div class="login__item">
          <m-button :title="t('signIn')" block :loading="loading" :disabled="loading" />
        </div>
      </form>
      <div class="login__other">
        <button @click="registration">{{ t('registration') }}</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .login {
    width: 100%;
    // .login__wrapper
    &__wrapper {
      width: 100%;
      padding: 30px 20px;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    // .login__title
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
    // .login__form
    &__form {
      margin-top: 180px;
    }
    // .login__item
    &__item {
      &:not(:first-child) {
        margin-top: 14px;
      }
    }
    // .login__other
    &__other {
      background-color: transparent;
      margin-top: 10px;
      margin-left: auto;
      button {
        background-color: transparent;
        font-size: 14px;
        font-weight: 500;
        color: var(--gray-500);
      }
    }
  }
</style>
