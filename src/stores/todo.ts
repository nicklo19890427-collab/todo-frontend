import { defineStore } from 'pinia'
import { ref } from 'vue'
import { todoApi } from '@/api/todos' // 引入 API 層
import type { Todo } from '@/types' // 引入型別定義

export const useTodoStore = defineStore('todo', () => {
  // --- 1. 狀態 (State) ---
  const todos = ref<Todo[]>([])

  // --- 2. 動作 (Actions) ---

  // 取得所有列表
  const fetchTodos = async () => {
    try {
      const response = await todoApi.getAll()
      todos.value = response.data
    } catch (error) {
      console.error('讀取失敗', error)
    }
  }

  // 新增待辦
  const addTodo = async (title: string) => {
    if (!title.trim()) return
    try {
      // 後端會回傳建立好的那筆資料 (包含 id)
      const response = await todoApi.create(title)
      // 我們直接把它塞進陣列，這樣就不用重新 fetch 全部的資料了 (效能比較好)
      todos.value.push(response.data)
    } catch (error) {
      console.error('新增失敗', error)
      throw error
    }
  }

  // 更新狀態 (打勾/取消)
  const updateTodo = async (todo: Todo) => {
    try {
      // 這裡我們把整包 todo 傳給後端
      const response = await todoApi.update(todo.id, todo)

      // 更新成功後，確保本地資料跟伺服器同步
      const index = todos.value.findIndex((t) => t.id === todo.id)
      if (index !== -1) {
        todos.value[index] = response.data
      }
    } catch (error) {
      console.error('更新失敗', error)
      throw error
    }
  }

  // 刪除待辦
  const deleteTodo = async (id: number) => {
    try {
      await todoApi.delete(id)
      // 成功後，直接從陣列中過濾掉這一筆
      todos.value = todos.value.filter((t) => t.id !== id)
    } catch (error) {
      console.error('刪除失敗', error)
      throw error
    }
  }

  return {
    todos,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  }
})
