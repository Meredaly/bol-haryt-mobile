import { createApp } from 'vue'
import { createPinia } from 'pinia'

import router from './router'
import { i18n } from '@/plugins/i18n'
import './plugins/chart.js'

import App from '@/App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
