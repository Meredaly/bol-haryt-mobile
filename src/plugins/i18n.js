import { createI18n } from 'vue-i18n'

import tm from '@/locales/tm'
import ru from '@/locales/ru'

const i18n = createI18n({
  locale: 'ru',
  globalInjection: true,
  messages: {
    tm: tm,
    ru: ru
  }
})

export { i18n }
