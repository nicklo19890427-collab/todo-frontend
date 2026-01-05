import api from './core'
import type { Category } from '@/types'

export const categoryApi = {
  getAll: () => api.get<Category[]>('/api/categories'),

  // ✨ 修改：加入 icon 參數
  create: (name: string, icon?: string) => api.post<Category>('/api/categories', { name, icon }),
}
