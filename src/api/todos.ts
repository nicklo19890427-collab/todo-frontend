import api from './core'
import type { Todo } from '@/types'

export const todoApi = {
  getAll: () => api.get<Todo[]>('/api/todos'),

  // ✨ 修正：加入 keyword 參數
  search: (params: { keyword?: string; categoryId?: number; priority?: string; date?: string }) =>
    api.get<Todo[]>('/api/todos/search', { params }),

  create: (data: { title: string; categoryId?: number; priority?: string; dueDate?: string }) => {
    return api.post<Todo>('/api/todos', {
      title: data.title,
      category: data.categoryId ? { id: data.categoryId } : null,
      priority: data.priority || 'LOW',
      dueDate: data.dueDate || null,
    })
  },

  update: (id: number, data: Todo) => api.put<Todo>(`/api/todos/${id}`, data),
  delete: (id: number) => api.delete(`/api/todos/${id}`),
}
