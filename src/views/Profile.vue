<script setup>
  import { ref, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import { useAuth } from '@/store/auth'
  import MImage from '@/UI/MImage.vue'
  import BaseIcon from '@/UI/BaseIcon.vue'
  import TheLanguage from '@/components/TheLanguage.vue'

  const { t, locale } = useI18n()

  const router = useRouter()

  const auth = useAuth()

  const user = computed(() => auth.getUser)

  const logOut = () => {
    auth.logOut()
    router.push('/login')
  }

  const showLanguage = ref(false)
  const openLanguage = () => {
    showLanguage.value = true
  }
  const closeLanguage = () => {
    showLanguage.value = false
  }

  const openEditProfile = () => {
    router.push('/profile-edit')
  }
  const openWithdrawer = () => {
    router.push('/withdrawer')
  }

  const languages = ref([
    { id: 'tm', name: 'Türkmen' },
    { id: 'ru', name: 'Русский' }
  ])

  const currentLanguage = computed(() => languages.value.find((lang) => lang.id === locale.value)?.name || '')
</script>

<template>
  <div class="profile">
    <div class="profile__wrapper">
      <div class="profile__head">
        <div class="profile__title">{{ t('profile') }}</div>
      </div>
      <button @click="openEditProfile" class="profile__user">
        <div class="profile__user-avatar">
          <m-image :image="user?.logo" width="45px" height="45px" circle />
        </div>
        <div class="profile__user-content">
          <p>{{ user?.name }}</p>
          <span>{{ user?.number }}</span>
        </div>
      </button>
      <div class="profile__box">
        <button @click="openWithdrawer" class="profile__withdrawer">
          <div class="profile__withdrawer-icon">
            <base-icon name="moneyHand" />
          </div>
          <p>{{ t('removal') }}</p>
          <base-icon name="chevronRight" />
        </button>
      </div>
      <div class="profile__box">
        <button @click="openLanguage" class="profile__box-item">
          <p>{{ t('language') }}</p>
          <div>{{ currentLanguage }}</div>
          <base-icon name="chevronRight" />
        </button>
      </div>

      <div class="profile__box">
        <button @click="logOut" class="profile__box-item">
          <p>{{ t('signOut') }}</p>
          <base-icon name="signOut" />
        </button>
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <the-language @close="closeLanguage" :show="showLanguage" />
  </teleport>
</template>

<style lang="scss" scoped>
  .profile {
    padding: 20px;
    // .profile__wrapper
    &__wrapper {
    }
    // .profile__head
    &__head {
      display: flex;
      justify-content: space-between;
    }
    // .profile__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--gray-900);
    }
    // .profile__end-date
    &__end-date {
      text-align: end;
      p {
        font-weight: 400;
        font-size: 12px;
        line-height: 120%;
        color: var(--gray-900);
      }
      span {
        font-weight: 600;
        font-size: 16px;
        line-height: 120%;
        /*  */
        color: var(--green-500);
      }
    }
    // .profile__user
    &__user {
      margin-top: 40px;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      padding: 9px 13px;
      display: flex;
      align-items: center;
      width: 100%;
    }
    // .profile__user-avatar
    &__user-avatar {
    }
    // .profile__user-content
    &__user-content {
      flex: 1 1;
      text-align: left;
      padding-left: 10px;

      p {
        font-weight: 600;
        font-size: 16px;
        line-height: 20px;
        color: var(--gray-900);
      }
      span {
        font-weight: 400;
        font-size: 14px;
        line-height: 120%;
        color: var(--gray-800);
        padding-top: 4px;
        display: block;
      }
    }

    // .profile__withdrawer
    &__withdrawer {
      width: 100%;
      background-color: transparent;
      display: flex;
      align-items: center;
      padding: 10px;
      p {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: var(--gray-800);
        flex: 1 1;
        text-align: left;
      }
    }
    // .profile__withdrawer-icon
    &__withdrawer-icon {
      color: var(--green-500);
      border: 1px solid var(--gray-300);
      padding: 10px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: var(--white);
    }

    // .profile__box
    &__box {
      margin: 10px 0px;
      background: var(--gray-100);
      border: 1px solid var(--gray-300);
      border-radius: 8px;
      overflow: hidden;
    }
    // .profile__box-item
    &__box-item {
      background-color: transparent;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      &:not(:last-child) {
        border-bottom: 1px solid var(--gray-300);
      }
      p {
        font-weight: 600;
        font-size: 14px;
        line-height: 16px;
        color: var(--gray-800);
        flex: 1 1;
        text-align: left;
      }
      div {
        font-size: 12px;
        padding-right: 10px;
        color: var(--gray-600);
      }
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }
</style>
