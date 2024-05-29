<script setup>
  import { ref } from 'vue'
  import { useCookies } from 'vue3-cookies'
  import { useI18n } from 'vue-i18n'
  import BaseIcon from '@/UI/BaseIcon.vue'

  const emit = defineEmits(['close'])

  const props = defineProps({
    show: { type: Boolean, default: false }
  })

  const { cookies } = useCookies()

  const { t, locale } = useI18n()

  const close = () => {
    emit('close')
  }
  const selectedLanguage = ref(null)
  const languages = ref([
    { id: 'tm', name: 'Türkmen' },
    { id: 'ru', name: 'Русский' }
  ])

  const selectLanguage = (lang) => {
    selectedLanguage.value = lang
    locale.value = lang.id
    cookies.set('lang', lang.id, 100000000)
    close()
  }

  if (cookies.get('lang')) {
    let lang = languages.value.find((lang) => lang.id === cookies.get('lang')) || null
    if (lang) selectLanguage(lang)
  } else {
    selectedLanguage.value = languages.value.find((lang) => lang.id === locale.value) || null
  }
</script>

<template>
  <div :class="['menu', { _show: show }]">
    <div class="menu__wrapper">
      <div class="menu__head _active">
        <button @click="close" class="menu__back">
          <base-icon name="arrowLeft" />
          <p>{{ t('back') }}</p>
        </button>
      </div>
      <div class="menu__body">
        <div class="language">
          <div class="language__items">
            <button
              v-for="language in languages"
              :key="language.id"
              @click="selectLanguage(language)"
              :class="['language__item', { _active: language.id === selectedLanguage.id }]"
            >
              <div class="language__item-title">{{ language.name }}</div>
              <div v-if="language.id === selectedLanguage.id" class="language__item-icon">
                <base-icon name="checkmark" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .language {
    // .language__items
    &__items {
    }
    // .language__item
    &__item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px;
      width: 100%;
      background-color: transparent;
      border-top: 1px solid var(--gray-100);
      &:first-child {
        border-top: none;
      }
      &._active {
        background-color: var(--gray-100);
      }
    }
    // .language__item-title
    &__item-title {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: var(--gray-900);
    }
    // .language__item-icon
    &__item-icon {
    }
  }
</style>
