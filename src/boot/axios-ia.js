import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api_ia = axios.create({ baseURL: process.env.IA_BACKEND_URL })

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api_ia
})

export { api_ia }
