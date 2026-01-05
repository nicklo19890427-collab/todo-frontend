<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'
import { simpleDialog } from '@/plugins/simpleDialog'
import TodoHeader from '@/components/TodoHeader.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoInput from '@/components/TodoInput.vue'
import TodoList from '@/components/TodoList.vue'

// ... (狀態與 loadTodos 邏輯保持不變) ...
const authStore = useAuthStore()
const todoStore = useTodoStore()

const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('ALL')
const selectedDueDate = ref('')
const isLoading = ref(false)

const loadTodos = async () => {
  isLoading.value = true
  await todoStore.fetchTodos({
    categoryId: selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value),
    priority: selectedPriority.value === 'ALL' ? undefined : selectedPriority.value,
    date: selectedDueDate.value || undefined,
  })
  isLoading.value = false
}

onMounted(async () => {
  await todoStore.fetchCategories()
  await loadTodos()
})

watch(
  [selectedCategoryId, selectedPriority, selectedDueDate],
  () => {
    loadTodos()
  },
  { deep: true },
)

// ✨ 修改：handleAddTodo 接收包含 dueDate 的 payload
const handleAddTodo = async (payload: {
  title: string
  categoryId?: number
  priority?: string
  dueDate?: string
}) => {
  try {
    await todoStore.addTodo({
      title: payload.title,
      categoryId: payload.categoryId,
      priority: payload.priority || 'LOW',
      dueDate: payload.dueDate, // 這裡接收到了日期
    })
  } catch {
    alert('新增失敗')
  }
}

const toggleTodo = async (todo: Todo) => {
  try {
    await todoStore.updateTodo(todo)
  } catch {
    todo.completed = !todo.completed
    alert('更新失敗')
  }
}
const handleUpdateTodo = async (todo: Todo) => {
  try {
    await todoStore.updateTodo(todo)
  } catch {
    alert('更新失敗')
  }
}
// ✨ 2. 修改：刪除確認 (展示 HTML 功能)
const handleDelete = async (id: number) => {
  // 使用 simpleDialog 取代 window.confirm
  const isConfirmed = await simpleDialog.confirm(
    // Title: 使用 HTML 加上紅色樣式
    `<span class="text-red-600 font-bold">⚠️ 刪除警告</span>`,

    // Content: 使用 HTML 換行並縮小說明文字
    `您確定要刪除這筆待辦事項嗎？<br><span class="text-sm text-gray-400">此動作將無法復原。</span>`,

    // Options
    {
      html: true, // 記得開啟 HTML 模式
      confirmText: '確認刪除',
      cancelText: '再想想',
    },
  )

  if (isConfirmed) {
    await todoStore.deleteTodo(id)
  }
}
// ✨ 3. 修改：登出確認
const handleLogout = async () => {
  const isConfirmed = await simpleDialog.confirm('登出系統', '您確定要登出嗎？', {
    confirmText: '登出',
    cancelText: '取消',
  })

  if (isConfirmed) {
    authStore.logout()
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <TodoHeader :username="authStore.user" @logout="handleLogout" />

      <TodoInput :categories="todoStore.categories" @add="handleAddTodo" />

      <TodoFilter
        :categories="todoStore.categories"
        :category-id="selectedCategoryId"
        :priority="selectedPriority"
        :due-date="selectedDueDate"
        @update:category-id="selectedCategoryId = $event"
        @update:priority="selectedPriority = $event"
        @update:due-date="selectedDueDate = $event"
      />

      <TodoList
        :todos="todoStore.todos"
        :loading="isLoading"
        @toggle="toggleTodo"
        @update="handleUpdateTodo"
        @delete="handleDelete"
      />
    </div>
  </div>
</template>
