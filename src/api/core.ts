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
      if (status === 401 || status === 403) {
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
