<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'

// 1. 引入 Stores
const authStore = useAuthStore()
const todoStore = useTodoStore()

// 2. 本地狀態
const newTodoTitle = ref('')
const isLoading = ref(false)

// 3. 動作定義

// 初始化：載入資料
onMounted(async () => {
  isLoading.value = true
  await todoStore.fetchTodos()
  isLoading.value = false
})

// 新增待辦
const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    await todoStore.addTodo(newTodoTitle.value)
    newTodoTitle.value = '' // 清空輸入框
  } catch (error) {
    alert('新增失敗，請稍後再試')
  }
}

// 切換完成狀態
const toggleTodo = async (todo: Todo) => {
  try {
    // 這裡不需要手動改 todo.completed，因為 v-model 已經改了
    // 我們只需要把最新的狀態傳給後端
    await todoStore.updateTodo(todo)
  } catch (error) {
    // 如果失敗，就把狀態改回來 (復原 UI)
    todo.completed = !todo.completed
    alert('更新失敗')
  }
}

// 刪除待辦
const handleDelete = async (id: number) => {
  if (!confirm('確定要刪除這個項目嗎？')) return

  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    alert('刪除失敗')
  }
}

// 登出
const handleLogout = () => {
  if (confirm('確定要登出嗎？')) {
    authStore.logout()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <header
        class="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
      >
        <div>
          <h1 class="text-2xl font-bold text-gray-800">我的待辦清單 📝</h1>
          <p class="text-gray-500 text-sm mt-1">
            Hi,
            <span class="font-bold text-emerald-600">{{ authStore.user }}</span>
            祝你有個美好的一天！
          </p>
        </div>

        <button
          @click="handleLogout"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
        >
          <span>🚪</span> 登出
        </button>
      </header>

      <div
        class="bg-white p-2 rounded-2xl shadow-lg mb-8 border border-gray-100 flex items-center gap-2"
      >
        <input
          v-model="newTodoTitle"
          @keyup.enter="handleAddTodo"
          type="text"
          placeholder="今天想要完成什麼？..."
          class="flex-1 px-6 py-4 bg-transparent outline-none text-gray-700 text-lg placeholder-gray-400"
          autofocus
        />
        <button
          @click="handleAddTodo"
          class="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold transition duration-200 shadow-md transform active:scale-95 flex-shrink-0 mr-1"
        >
          <span class="hidden sm:inline">新增項目</span>
          <span class="sm:hidden">+</span>
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-gray-500">
        <div class="animate-spin text-3xl mb-2">⏳</div>
        <p>資料載入中...</p>
      </div>

      <ul v-else class="space-y-3">
        <li
          v-for="todo in todoStore.todos"
          :key="todo.id"
          class="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between"
          :class="{ 'opacity-60 bg-gray-50': todo.completed }"
        >
          <div class="flex items-center gap-4 flex-1 overflow-hidden">
            <label class="relative flex items-center justify-center cursor-pointer p-2">
              <input
                type="checkbox"
                v-model="todo.completed"
                @change="toggleTodo(todo)"
                class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:bg-emerald-500 checked:border-emerald-500 transition-colors"
              />
              <svg
                class="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="4"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </label>

            <span
              class="text-lg text-gray-700 truncate transition-all duration-200 select-none cursor-pointer"
              :class="{ 'line-through text-gray-400': todo.completed }"
              @click="(todo.completed = !todo.completed) && toggleTodo(todo)"
            >
              {{ todo.title }}
            </span>
          </div>

          <button
            @click="handleDelete(todo.id)"
            class="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="刪除"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </li>
      </ul>

      <div v-if="!isLoading && todoStore.todos.length === 0" class="text-center py-16">
        <div class="text-6xl mb-4">🍃</div>
        <h3 class="text-xl font-medium text-gray-600">目前沒有待辦事項</h3>
        <p class="text-gray-400 mt-2">享受你的自由時間，或是新增一個挑戰吧！</p>
      </div>
    </div>
  </div>
</template>
