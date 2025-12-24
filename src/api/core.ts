import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

// 設定 Base URL
const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/todos', '')
  : 'http://localhost:8080'

// 建立實體
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

// 請求攔截 (Request Interceptor)
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('todo_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// 回應攔截 (Response Interceptor)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status
      const requestUrl = error.config?.url || '' // ✨ 取得請求的網址

      // ✨ 修正邏輯：只有當 "非登入API" 發生 401 時，才強制登出跳轉
      // 這樣輸入錯密碼時，就不會導致頁面重新整理了
      if ((status === 401 || status === 403) && !requestUrl.includes('/auth/login')) {
        console.warn('權限失效，強制登出')
        localStorage.removeItem('todo_token')
        localStorage.removeItem('todo_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
