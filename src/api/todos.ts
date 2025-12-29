import api from './core'
import type { Todo } from '@/types'

export const todoApi = {
  getAll: () => api.get<Todo[]>('/api/todos'),

  // ✨ 修改：接收 title, categoryId, priority, dueDate
  // 我們把參數改成用物件傳遞比較整潔，或者繼續加在後面
  create: (data: { title: string; categoryId?: number; priority?: string; dueDate?: string }) => {
    return api.post<Todo>('/api/todos', {
      title: data.title,
      // 如果有選分類，傳物件；沒選傳 null
      category: data.categoryId ? { id: data.categoryId } : null,
      priority: data.priority || 'LOW', // 預設 LOW
      dueDate: data.dueDate || null, // 沒選就是 null
    })
  },

  update: (id: number, data: Todo) => api.put<Todo>(`/api/todos/${id}`, data),
  delete: (id: number) => api.delete(`/api/todos/${id}`),
}
