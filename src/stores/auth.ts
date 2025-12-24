import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router'
import { authApi } from '@/api/auth' // 1. 引入剛剛寫好的 API 層
import type { User } from '@/types' // 2. 引入型別定義

export const useAuthStore = defineStore('auth', () => {
  // --- 1. 狀態 (State) ---
  const token = ref<string>(localStorage.getItem('todo_token') || '')
  const user = ref<string>(localStorage.getItem('todo_user') || '')

  // --- 2. 計算屬性 (Getters) ---
  const isAuthenticated = computed(() => !!token.value)

  // --- 3. 動作 (Actions) ---

  // 登入
  const login = async (username: string, password: string) => {
    try {
      // ✨ 這裡變超乾淨！直接呼叫 API 層的方法
      const response = await authApi.login({ username, password })

      // TypeScript 知道 response.data 是 User 型別 (因為我們在 api/auth.ts 定義過泛型)
      const data = response.data

      // 更新 Pinia 狀態
      token.value = data.token
      user.value = data.username

      // 寫入 LocalStorage
      localStorage.setItem('todo_token', token.value)
      localStorage.setItem('todo_user', user.value)

      // 導向首頁
      router.push('/')
    } catch (error) {
      // 錯誤繼續往外拋，讓 UI 層決定要顯示什麼錯誤訊息
      throw error
    }
  }

  // 註冊
  const register = async (username: string, password: string) => {
    try {
      await authApi.register({ username, password })
      // 註冊成功，不做跳轉，讓 UI 提示使用者去登入
    } catch (error) {
      throw error
    }
  }

  // 登出
  const logout = () => {
    token.value = ''
    user.value = ''

    localStorage.removeItem('todo_token')
    localStorage.removeItem('todo_user')

    router.push('/login')
  }

  return {
    token,
    user,
    isAuthenticated,
    login,
    register,
    logout,
  }
})
