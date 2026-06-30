import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const TOKEN_KEY = 'en:auth:accessToken'

const api_ia = axios.create({
  baseURL: process.env.IA_BACKEND_URL
})

api_ia.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api_ia.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem('en:auth:user')
    }

    return Promise.reject(error)
  }
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$apiIa = api_ia
})

export { api_ia, TOKEN_KEY }