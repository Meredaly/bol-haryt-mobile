<script setup>
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useCookies } from 'vue3-cookies'

  import { useAuth } from '@/store/auth'
  import TabBar from '@/components/TabBar.vue'

  const auth = useAuth()
  const isAuth = computed(() => auth.isAuth)

  const { cookies } = useCookies()

  const { locale } = useI18n()

  const languages = ref([
    { id: 'tm', name: 'Türkmen' },
    { id: 'ru', name: 'Русский' }
  ])

  if (cookies.get('lang')) {
    let lang = languages.value.find((lang) => lang.id === cookies.get('lang')) || null
    if (lang) {
      locale.value = lang.id
    }
  }
</script>

<template>
  <div v-if="isAuth" class="main">
    <div class="main__wrapper">
      <div class="main__body">
        <router-view />
      </div>
      <div class="main__tab-bar">
        <tab-bar />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .main {
    padding-bottom: 55px;
    height: 100vh;
    overflow: hidden;
    // .main__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
    }
    // .main__body
    &__body {
      height: 100%;
      overflow-y: auto;
    }
    // .main__tab-bar
    &__tab-bar {
      position: fixed;
      z-index: 1;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
</style>
