import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import { CHECK_SELLER_AUTH } from '../api/auth.api'

import router from '@/router'

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    auth: false,
    user: null
  }),

  getters: {
    isAuth() {
      return this.auth
    },
    getUser() {
      return this.user
    }
  },

  actions: {
    async getProfile() {
      const { cookies } = useCookies()
      if (cookies.get('Authorization')) {
        try {
          const { data, status } = await CHECK_SELLER_AUTH()
          if (status === 'auth error') {
            router.push('/login')
          }
          this.user = data
          this.auth = true
        } catch (error) {
          console.error(error)
        }
        return
      }
      router.push('/login')
    },
    logOut() {
      this.user = null
      this.auth = false
      const { cookies } = useCookies()
      cookies.remove('Authorization')
      router.push('/login')
    }
  }
})
