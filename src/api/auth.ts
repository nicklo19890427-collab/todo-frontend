import api from './core'
import type { User } from '@/types'

// 定義請求的資料型別 (可以寫在這裡或是 types.ts，這裡簡單寫)
interface AuthPayload {
  username: string
  password: string
}

export const authApi = {
  // 登入
  login: (data: AuthPayload) => {
    // 泛型 <User> 告訴 TS 回傳的 data 是 User 格式
    return api.post<User>('/api/auth/login', data)
  },

  // 註冊
  register: (data: AuthPayload) => {
    return api.post('/api/auth/register', data)
  },
}
