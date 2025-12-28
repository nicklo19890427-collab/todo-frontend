import api from './core'
import type { Todo } from '@/types'

export const todoApi = {
  // 取得所有列表
  getAll: () => {
    return api.get<Todo[]>('/api/todos')
  },

  // ✨ 修改：多接收一個 categoryId 參數 (選填)
  create: (title: string, categoryId?: number) => {
    return api.post<Todo>('/api/todos', {
      title,
      // 如果有選分類，就傳送物件格式給後端 (後端 JPA 會自動對應 ID)
      // 如果沒選 (undefined)，就傳 null
      category: categoryId ? { id: categoryId } : null,
    })
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
