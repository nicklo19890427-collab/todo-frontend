import api from './core'
import type { Todo } from '@/types'

export const todoApi = {
  // 取得所有列表
  getAll: () => {
    return api.get<Todo[]>('/api/todos')
  },

  // 新增
  create: (title: string) => {
    return api.post<Todo>('/api/todos', { title, completed: false })
  },

  // 更新 (包含切換狀態或改標題)
  update: (id: number, data: Todo) => {
    return api.put<Todo>(`/api/todos/${id}`, data)
  },

  // 刪除
  delete: (id: number) => {
    return api.delete(`/api/todos/${id}`)
  },
}
