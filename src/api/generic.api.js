import axios from 'axios'
import { useCookies } from 'vue3-cookies'

const BASE_URL = import.meta.env.VITE_APP_BASE_URL

export const request = async ({ url, method = 'POST', headers = {}, params = {}, data = {}, onUploadProgress = {}, file = false }) => {
  const { cookies } = useCookies()

  if (file) {
    const formData = new FormData()
    headers['Accept'] = 'application/json'
    headers['Content-Type'] = 'multipart/form-data'

    for (let [key, value] of Object.entries(data)) {
      formData.append(key, value)
    }
    data = formData
  }
  if (cookies.get('Authorization')) {
    headers['Authorization'] = 'Bearer ' + cookies.get('Authorization')
  }

  const response = await axios({
    url: `${BASE_URL}${url}`,
    method,
    headers,
    ...onUploadProgress,
    params,
    data
  })
  return response.data
}
