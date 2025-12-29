<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'

const authStore = useAuthStore()
const todoStore = useTodoStore()

// --- 輸入狀態 ---
const newTodoTitle = ref('')
const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('LOW') // ✨ 新增：優先級 (預設 LOW)
const selectedDueDate = ref('') // ✨ 新增：截止日期

const isLoading = ref(false)
const isCreatingCategory = ref(false)
const newCategoryName = ref('')
const editingId = ref<number | null>(null)
const editingTitle = ref('')

onMounted(async () => {
  isLoading.value = true
  await Promise.all([todoStore.fetchTodos(), todoStore.fetchCategories()])
  isLoading.value = false
})

// 新增待辦
const handleAddTodo = async () => {
  if (!newTodoTitle.value.trim()) return

  try {
    await todoStore.addTodo({
      title: newTodoTitle.value,
      categoryId: selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value),
      priority: selectedPriority.value, // ✨ 傳送優先級
      dueDate: selectedDueDate.value, // ✨ 傳送日期
    })

    // 重置輸入框 (保留分類和優先級設定，這通常比較方便，看個人習慣)
    newTodoTitle.value = ''
    // selectedDueDate.value = '' // 如果想每次清空日期可解開這行
  } catch (error) {
    alert('新增失敗')
  }
}

const handleAddCategory = async () => {
  if (!newCategoryName.value.trim()) return
  try {
    const newCategory = await todoStore.addCategory(newCategoryName.value)
    if (newCategory) selectedCategoryId.value = newCategory.id
    newCategoryName.value = ''
    isCreatingCategory.value = false
  } catch (error) {
    alert('建立分類失敗')
  }
}

// ... (toggleTodo, handleDelete, handleLogout, 編輯功能 保持不變)
const toggleTodo = async (todo: Todo) => {
  try {
    await todoStore.updateTodo(todo)
  } catch {
    todo.completed = !todo.completed
    alert('更新失敗')
  }
}

const handleDelete = async (id: number) => {
  if (!confirm('確定刪除？')) return
  await todoStore.deleteTodo(id)
}

const handleLogout = () => {
  if (confirm('登出？')) authStore.logout()
}

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
    await todoStore.updateTodo({ ...todo, title: newTitle })
    editingId.value = null
  } catch {
    alert('更新失敗')
    cancelEdit()
  }
}

// --- ✨ 輔助函式：根據優先級回傳顏色 Class ---
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-100 text-red-700 border-red-200'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'LOW':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

// --- ✨ 輔助函式：顯示優先級中文 ---
const getPriorityLabel = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return '🔥 高'
    case 'MEDIUM':
      return '⚡ 中'
    case 'LOW':
      return '☕ 低'
    default:
      return '低'
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
          🚪 登出
        </button>
      </header>

      <div class="flex flex-wrap items-center gap-3 mb-3 px-2">
        <select v-model="selectedCategoryId" class="input-base w-32">
          <option value="">📂 未分類</option>
          <option v-for="cat in todoStore.categories" :key="cat.id" :value="cat.id">
            🏷️ {{ cat.name }}
          </option>
        </select>

        <select v-model="selectedPriority" class="input-base w-24">
          <option value="LOW">☕ 低</option>
          <option value="MEDIUM">⚡ 中</option>
          <option value="HIGH">🔥 高</option>
        </select>

        <input type="date" v-model="selectedDueDate" class="input-base text-gray-600" />

        <div class="flex items-center gap-2 ml-auto">
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
          @keyup.enter="handleAddTodo"
        />
        <button
          @click="handleAddTodo"
          class="bg-emerald-500 hover:bg-emerald-600 text-white p-4 rounded-xl font-bold transition shadow-md active:scale-95 flex-shrink-0 mr-1"
        >
          新增
        </button>
      </div>

      <div v-if="isLoading" class="text-center py-12 text-gray-500">
        <div class="animate-spin text-3xl mb-2">⏳</div>
        <p>載入中...</p>
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

            <div class="flex-1 flex flex-col justify-center gap-1">
              <input
                v-if="editingId === todo.id"
                :id="`edit-input-${todo.id}`"
                v-model="editingTitle"
                @blur="saveEdit(todo)"
                @keyup.enter="saveEdit(todo)"
                @keyup.esc="cancelEdit"
                type="text"
                class="w-full px-2 py-1 border-b-2 border-emerald-500 outline-none bg-transparent text-lg text-gray-700"
              />
              <span
                v-else
                class="text-lg text-gray-700 truncate cursor-pointer"
                :class="{ 'line-through text-gray-400': todo.completed }"
                @dblclick="startEdit(todo)"
                >{{ todo.title }}</span
              >

              <div class="flex items-center gap-2 text-xs flex-wrap">
                <span
                  v-if="todo.category"
                  class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium"
                >
                  🏷️ {{ todo.category.name }}
                </span>

                <span
                  class="px-2 py-0.5 rounded-full border font-medium"
                  :class="getPriorityColor(todo.priority)"
                >
                  {{ getPriorityLabel(todo.priority) }}
                </span>

                <span
                  v-if="todo.dueDate"
                  class="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200"
                >
                  📅 {{ todo.dueDate }}
                </span>
              </div>
            </div>
          </div>

          <button
            v-if="editingId !== todo.id"
            @click="handleDelete(todo.id)"
            class="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition opacity-0 group-hover:opacity-100"
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
/* ✨ 告訴 Tailwind 去 main.css 找定義 */
@reference "@/assets/main.css";
/* 共用輸入框樣式 */
.input-base {
  @apply bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2 outline-none cursor-pointer hover:bg-gray-50 transition;
}
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
