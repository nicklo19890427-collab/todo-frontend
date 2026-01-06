<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons' // ✨ Import Plus Icon
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'
import { simpleDialog } from '@/plugins/simpleDialog'

import TodoHeader from '@/components/TodoHeader.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoList from '@/components/TodoList.vue'
import TodoFormDialog from '@/components/TodoFormDialog.vue' // ✨ Import Dialog
import BaseButton from '@/components/ui/BaseButton.vue' // ✨ Import Button

const authStore = useAuthStore()
const todoStore = useTodoStore()

// ... (Filter 狀態保持不變) ...
const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('ALL')
const selectedDueDate = ref('')
const isLoading = ref(false)

// 修改 query 定義，加入 keyword
const query = ref({
  keyword: '',
  categoryId: '' as number | '',
  priority: 'ALL',
  dueDate: '',
})

// ✨ 新增：Dialog 相關狀態
const isFormDialogOpen = ref(false)
const editingTodo = ref<Todo | null>(null) // 如果有值就是編輯，null 就是新增

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
  query,
  (newQuery) => {
    todoStore.fetchTodos(newQuery)
  },
  { deep: true },
) // deep: true 確保物件內部屬性改變也能監聽到

watch(
  [selectedCategoryId, selectedPriority, selectedDueDate],
  () => {
    loadTodos()
  },
  { deep: true },
)

// ✨ 新增：打開新增視窗
const openAddDialog = () => {
  editingTodo.value = null // 清空編輯狀態
  isFormDialogOpen.value = true
}

// ✨ 新增：打開編輯視窗
const openEditDialog = (todo: Todo) => {
  editingTodo.value = todo // 設定要編輯的物件
  isFormDialogOpen.value = true
}

// ✨ 新增：統一處理提交 (新增或更新)
const handleFormSubmit = async (payload: {
  title: string
  categoryId?: number
  priority?: string
  dueDate?: string
}) => {
  try {
    if (editingTodo.value) {
      // 編輯模式
      await todoStore.updateTodo({
        ...editingTodo.value, // 保留原有的 id, completed 等欄位
        title: payload.title,
        category: payload.categoryId ? { id: payload.categoryId } : undefined, // 注意這裡需要轉成物件結構或對應後端需求
        priority: payload.priority || 'LOW',
        dueDate: payload.dueDate,
      } as Todo)
    } else {
      // 新增模式
      await todoStore.addTodo({
        title: payload.title,
        categoryId: payload.categoryId,
        priority: payload.priority || 'LOW',
        dueDate: payload.dueDate,
      })
    }
  } catch (e) {
    alert('操作失敗')
    console.error(e)
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

const handleDelete = async (id: number) => {
  const isConfirmed = await simpleDialog.confirm(
    `<span class="text-red-600 font-bold">⚠️ 刪除警告</span>`,
    `您確定要刪除這筆待辦事項嗎？<br><span class="text-sm text-gray-400">此動作將無法復原。</span>`,
    { html: true, confirmText: '確認刪除', cancelText: '再想想' },
  )
  if (isConfirmed) await todoStore.deleteTodo(id)
}

const handleLogout = async () => {
  if (await simpleDialog.confirm('登出系統', '您確定要登出嗎？')) authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <TodoHeader :username="authStore.user" @logout="handleLogout" />

      <div class="mb-6 flex justify-end">
        <BaseButton
          variant="primary"
          :icon="faPlus"
          class="w-full sm:w-auto shadow-sm py-2 px-4 text-base"
          @click="openAddDialog"
        >
          新增待辦事項
        </BaseButton>
      </div>

      <TodoFilter
        :categories="todoStore.categories"
        v-model:keyword="query.keyword"
        v-model:categoryId="query.categoryId"
        v-model:priority="query.priority"
        v-model:dueDate="query.dueDate"
      />

      <TodoList
        :todos="todoStore.todos"
        :loading="isLoading"
        @toggle="toggleTodo"
        @edit="openEditDialog"
        @delete="handleDelete"
      />

      <TodoFormDialog
        v-model="isFormDialogOpen"
        :todo="editingTodo"
        :categories="todoStore.categories"
        @submit="handleFormSubmit"
      />
    </div>
  </div>
</template>
