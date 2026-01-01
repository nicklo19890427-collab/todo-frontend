// src/stores/todo.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todoApi } from '@/api/todos'
import { categoryApi } from '@/api/categories'
import type { Todo, Category } from '@/types'

export const useTodoStore = defineStore('todo', () => {
  const todos = ref<Todo[]>([])
  const categories = ref<Category[]>([])

  // ✨ 修改：fetchTodos 支援傳入篩選參數
  const fetchTodos = async (filters?: {
    categoryId?: number
    priority?: string
    date?: string
  }) => {
    try {
      let response
      // 如果有任何篩選條件，就走搜尋 API
      if (filters && (filters.categoryId || filters.priority || filters.date)) {
        response = await todoApi.search(filters)
      } else {
        // 否則走原本的 getAll (雖然搜尋 API 參數全空也有一樣效果，但保留 getAll 語意較清晰)
        response = await todoApi.getAll()
      }
      todos.value = response.data
    } catch (error) {
      console.error('讀取 Todo 失敗', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      categories.value = response.data
    } catch (error) {
      console.error('讀取分類失敗', error)
    }
  }

  // ✨ 修改：addTodo 接收一個參數物件
  const addTodo = async (payload: {
    title: string
    categoryId?: number
    priority?: string
    dueDate?: string
  }) => {
    if (!payload.title.trim()) return
    try {
      // 呼叫 API
      const response = await todoApi.create(payload)
      todos.value.push(response.data)
    } catch (error) {
      console.error('新增失敗', error)
      throw error
    }
  }

  // ... (addCategory, updateTodo, deleteTodo 保持不變)
  const addCategory = async (name: string) => {
    if (!name.trim()) return
    try {
      const response = await categoryApi.create(name)
      categories.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('新增分類失敗', error)
      throw error
    }
  }

  const updateTodo = async (todo: Todo) => {
    try {
      const response = await todoApi.update(todo.id, todo)
      const index = todos.value.findIndex((t) => t.id === todo.id)
      if (index !== -1) todos.value[index] = response.data
    } catch (error) {
      console.error('更新失敗', error)
      throw error
    }
  }

  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id)
      todos.value = todos.value.filter((t) => t.id !== id)
    } catch (error) {
      console.error('刪除失敗', error)
      throw error
    }
  }

  return {
    todos,
    categories,
    fetchTodos,
    fetchCategories,
    addTodo,
    addCategory,
    updateTodo,
    deleteTodo,
  }
})
