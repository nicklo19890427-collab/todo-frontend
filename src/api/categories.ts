import api from './core'
import type { Category } from '@/types'

export const categoryApi = {
  // 取得所有分類
  getAll: () => api.get<Category[]>('/api/categories'),

  // 新增分類
  create: (name: string) => api.post<Category>('/api/categories', { name }),
}
