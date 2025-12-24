<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'

// 1. Stores
const authStore = useAuthStore()
const todoStore = useTodoStore()

// 2. 本地狀態
const newTodoTitle = ref('')
const isLoading = ref(false)

// --- 分類相關狀態 ---
const selectedCategoryId = ref<number | ''>('') // 目前選中的分類 ID (空字串代表未分類)
const isCreatingCategory = ref(false) // 是否正在輸入新分類名稱
const newCategoryName = ref('') // 新分類名稱

// --- 編輯模式狀態 (保持之前的邏輯) ---
const editingId = ref<number | null>(null)
const editingTitle = ref('')

// 3. 初始化
onMounted(async () => {
  isLoading.value = true
  // 先只讀取 Todo，看看還會不會跳回登入？
  await todoStore.fetchTodos()
  setTimeout(() => {
    todoStore.fetchCategories()
  }, 10000)
  // await todoStore.fetchCategories() // 👈 先註解這行測試
  isLoading.value = false
})

// --- 動作定義 ---

// 新增待辦 (支援分類)
const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    // 轉換分類 ID: 如果是空字串，就傳 undefined 給 Store
    const categoryId =
      selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value)

    await todoStore.addTodo(newTodoTitle.value, categoryId)

    newTodoTitle.value = '' // 清空輸入框
  } catch (error) {
    alert('新增失敗')
  }
}

// 新增分類
const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return

  try {
    // 呼叫 Store 建立分類
    const newCategory = await todoStore.addCategory(newCategoryName.value)

    // 建立成功後，自動選中這個新分類
    if (newCategory) {
      selectedCategoryId.value = newCategory.id
    }

    // 重置狀態
    newCategoryName.value = ''
    isCreatingCategory.value = false
  } catch (error) {
    alert('建立分類失敗')
  }
}

// (以下保持原本的 CRUD 邏輯)
const toggleTodo = async (todo: Todo) => {
  try {
    await todoStore.updateTodo(todo)
  } catch (error) {
    todo.completed = !todo.completed
    alert('更新失敗')
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('確定要刪除這個項目嗎？')) return
  try {
    await todoStore.deleteTodo(id)
  } catch (error) {
    alert('刪除失敗')
  }
}

const handleLogout = () => {
  if (confirm('確定要登出嗎？')) authStore.logout()
}

// 編輯相關 (保持不變)
const startEdit = (todo: Todo) => {
  if (todo.completed) return
  editingId.value = todo.id
  editingTitle.value = todo.title
  nextTick(() => {
    const input = document.getElementById(`edit-input-${todo.id}`) as HTMLInputElement
    if (input) input.focus()
  })
}
const cancelEdit = () => {
  editingId.value = null
  editingTitle.value = ''
}
const saveEdit = async (todo: Todo) => {
  if (editingId.value !== todo.id) return
  const newTitle = editingTitle.value.trim()
  if (!newTitle || newTitle === todo.title) {
    cancelEdit()
    return
  }
  try {
    const updatedTodo = { ...todo, title: newTitle }
    await todoStore.updateTodo(updatedTodo)
    editingId.value = null
  } catch (error) {
    alert('更新失敗')
    cancelEdit()
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
            Hi, <span class="font-bold text-emerald-600">{{ authStore.user }}</span>
          </p>
        </div>
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg text-sm font-medium transition flex items-center gap-2"
        >
          <span>🚪</span> 登出
        </button>
      </header>

      <div class="flex items-center gap-3 mb-3 px-2">
        <select
          v-model="selectedCategoryId"
          class="bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none cursor-pointer hover:bg-gray-50 transition"
        >
          <option value="">📂 未分類</option>
          <option v-for="cat in todoStore.categories" :key="cat.id" :value="cat.id">
            🏷️ {{ cat.name }}
          </option>
        </select>

        <div class="flex items-center gap-2">
          <button
            v-if="!isCreatingCategory"
            @click="isCreatingCategory = true"
            class="text-sm text-emerald-600 hover:text-emerald-700 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition"
          >
            + 新增分類
          </button>

          <div v-else class="flex items-center gap-1 animate-fadeIn">
            <input
              v-model="newCategoryName"
              type="text"
              placeholder="分類名稱..."
              class="border border-emerald-300 rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-emerald-200 w-32"
              @keyup.enter="handleAddCategory"
            />
            <button
              @click="handleAddCategory"
              class="text-emerald-600 hover:bg-emerald-100 p-1 rounded"
            >
              ✅
            </button>
            <button
              @click="isCreatingCategory = false"
              class="text-gray-400 hover:bg-gray-100 p-1 rounded"
            >
              ❌
            </button>
          </div>
        </div>
      </div>

      <div
        class="bg-white p-2 rounded-2xl shadow-lg mb-8 border border-gray-100 flex items-center gap-2"
      >
        <input
          v-model="newTodoTitle"
          type="text"
          placeholder="今天想要完成什麼？..."
          class="flex-1 px-6 py-4 bg-transparent outline-none text-gray-700 text-lg placeholder-gray-400"
          autofocus
        />
        <button
          @click="handleAddTodo"
          class="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold transition duration-200 shadow-md transform active:scale-95 flex-shrink-0 mr-1"
        >
          <span class="hidden sm:inline">新增</span>
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

            <div class="flex-1 flex flex-col justify-center">
              <input
                v-if="editingId === todo.id"
                :id="`edit-input-${todo.id}`"
                v-model="editingTitle"
                @blur="saveEdit(todo)"
                @keyup.esc="cancelEdit"
                type="text"
                class="w-full px-2 py-1 border-b-2 border-emerald-500 outline-none bg-transparent text-lg text-gray-700"
              />

              <div v-else class="flex items-center gap-2 flex-wrap">
                <span
                  class="text-lg text-gray-700 truncate transition-all duration-200 select-none cursor-pointer"
                  :class="{ 'line-through text-gray-400': todo.completed }"
                  @dblclick="startEdit(todo)"
                  title="雙擊編輯"
                >
                  {{ todo.title }}
                </span>

                <span
                  v-if="todo.category"
                  class="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 font-medium"
                >
                  {{ todo.category.name }}
                </span>
              </div>
            </div>
          </div>

          <button
            v-if="editingId !== todo.id"
            @click="handleDelete(todo.id)"
            class="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
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
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 簡單的淡入動畫 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
