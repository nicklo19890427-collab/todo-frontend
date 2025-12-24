import request from './core'
import type { Category } from '@/types'

export const categoryApi = {
  // 取得所有分類
  getAll: () => request.get<Category[]>('/categories'),

  // 新增分類
  create: (name: string) => request.post<Category>('/categories', { name }),
}
