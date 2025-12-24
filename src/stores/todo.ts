import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todoApi } from '@/api/todos'
import { categoryApi } from '@/api/categories' // ✨ 引入新 API
import type { Todo, Category } from '@/types'

export const useTodoStore = defineStore('todo', () => {
  // --- 1. 狀態 (State) ---
  const todos = ref<Todo[]>([])
  const categories = ref<Category[]>([]) // ✨ 新增：分類列表

  // --- 2. 動作 (Actions) ---

  // 取得所有列表 (Todo)
  const fetchTodos = async () => {
    try {
      const response = await todoApi.getAll()
      todos.value = response.data
    } catch (error) {
      console.error('讀取 Todo 失敗', error)
    }
  }

  // ✨ 新增：取得所有分類
  const fetchCategories = async () => {
    try {
      const response = await categoryApi.getAll()
      categories.value = response.data
    } catch (error) {
      console.error('讀取分類失敗', error)
    }
  }

  // ✨ 修改：新增待辦 (支援分類 ID)
  const addTodo = async (title: string, categoryId?: number) => {
    if (!title.trim()) return
    try {
      // 呼叫 API 時把 categoryId 帶進去
      const response = await todoApi.create(title, categoryId)
      todos.value.push(response.data)
    } catch (error) {
      console.error('新增失敗', error)
      throw error
    }
  }

  // ✨ 新增：建立新分類
  const addCategory = async (name: string) => {
    if (!name.trim()) return
    try {
      const response = await categoryApi.create(name)
      categories.value.push(response.data) // 加到本地列表，讓下拉選單立刻更新
      return response.data
    } catch (error) {
      console.error('新增分類失敗', error)
      throw error
    }
  }

  // 更新與刪除 (保持不變)
  const updateTodo = async (todo: Todo) => {
    try {
      const response = await todoApi.update(todo.id, todo)
      const index = todos.value.findIndex((t) => t.id === todo.id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
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
    categories, // ✨ 匯出分類狀態
    fetchTodos,
    fetchCategories, // ✨ 匯出讀取分類動作
    addTodo,
    addCategory, // ✨ 匯出新增分類動作
    updateTodo,
    deleteTodo,
  }
})
