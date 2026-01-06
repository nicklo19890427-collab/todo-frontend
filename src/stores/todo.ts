import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todoApi } from '@/api/todos'
import { categoryApi } from '@/api/categories'
import type { Todo, Category } from '@/types'

export const useTodoStore = defineStore('todo', () => {
  // 1. 定義 State
  const todos = ref<Todo[]>([])
  const categories = ref<Category[]>([])

  // ✨ 修正：補上 isLoading 和 error 的定義
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 2. Actions

  // 取得待辦事項 (支援篩選)
  const fetchTodos = async (filters?: {
    keyword?: string // ✨ 確保這裡跟 API 參數一致
    categoryId?: number
    priority?: string
    date?: string
  }) => {
    // 開始載入前，設定 isLoading 為 true
    isLoading.value = true
    error.value = null // 清空舊的錯誤

    try {
      let response
      // 只要有傳入 filters 且裡面有值，就走搜尋 API
      if (filters && (filters.keyword || filters.categoryId || filters.priority || filters.date)) {
        // 注意：這裡要做參數轉換，因為 store 接收的參數名稱可能跟 API 需要的不完全一樣
        // 確保傳給 api.search 的物件符合 { keyword, categoryId, priority, date }
        response = await todoApi.search({
          keyword: filters.keyword,
          categoryId: filters.categoryId,
          priority: filters.priority,
          date: filters.date,
        })
      } else {
        // 否則載入全部
        response = await todoApi.getAll()
      }
      todos.value = response.data
    } catch (err) {
      console.error('讀取 Todo 失敗', err)
      error.value = '無法載入待辦事項'
    } finally {
      // 無論成功失敗，最後都要關閉 isLoading
      isLoading.value = false
    }
  }

  // 取得分類
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      categories.value = response.data
    } catch (err) {
      console.error('讀取分類失敗', err)
    }
  }

  // 新增待辦事項
  const addTodo = async (payload: {
    title: string
    categoryId?: number
    priority?: string
    dueDate?: string
  }) => {
    if (!payload.title.trim()) return
    isLoading.value = true
    try {
      const response = await todoApi.create(payload)
      todos.value.push(response.data)
    } catch (err) {
      console.error('新增失敗', err)
      error.value = '新增失敗'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 新增分類
  const addCategory = async (name: string, icon: string = 'folder') => {
    if (!name.trim()) return
    try {
      const response = await categoryApi.create(name, icon)
      categories.value.push(response.data)
      return response.data
    } catch (err) {
      console.error('新增分類失敗', err)
      throw err
    }
  }

  // 更新待辦事項
  const updateTodo = async (todo: Todo) => {
    try {
      const response = await todoApi.update(todo.id, todo)
      const index = todos.value.findIndex((t) => t.id === todo.id)
      if (index !== -1) todos.value[index] = response.data
    } catch (err) {
      console.error('更新失敗', err)
      throw err
    }
  }

  // 刪除待辦事項
  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id)
      todos.value = todos.value.filter((t) => t.id !== id)
    } catch (err) {
      console.error('刪除失敗', err)
      throw err
    }
  }

  // 3. Return (一定要把 state 和 action 都 return 出去)
  return {
    todos,
    categories,
    isLoading, // ✨ 記得匯出
    error, // ✨ 記得匯出
    fetchTodos,
    fetchCategories,
    addTodo,
    addCategory,
    updateTodo,
    deleteTodo,
  }
})
