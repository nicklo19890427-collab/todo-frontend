<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useTodoStore } from '@/stores/todo'
import type { Todo } from '@/types'

import TodoHeader from '@/components/TodoHeader.vue'
import TodoFilter from '@/components/TodoFilter.vue'
import TodoInput from '@/components/TodoInput.vue'
import TodoList from '@/components/TodoList.vue'

const authStore = useAuthStore()
const todoStore = useTodoStore()

const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('LOW')
const selectedDueDate = ref('')
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  await Promise.all([todoStore.fetchTodos(), todoStore.fetchCategories()])
  isLoading.value = false
})

const handleAddTodo = async (title: string) => {
  try {
    await todoStore.addTodo({
      title,
      categoryId: selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value),
      priority: selectedPriority.value,
      dueDate: selectedDueDate.value,
    })
  } catch {
    alert('新增失敗')
  }
}

const handleCreateCategory = async (name: string) => {
  try {
    const newCategory = await todoStore.addCategory(name)
    if (newCategory) selectedCategoryId.value = newCategory.id
  } catch {
    alert('建立分類失敗')
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
const handleDelete = async (id: number) => {
  if (confirm('確定刪除？')) await todoStore.deleteTodo(id)
}
const handleLogout = () => {
  if (confirm('登出？')) authStore.logout()
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto">
      <TodoHeader :username="authStore.user" @logout="handleLogout" />
      <TodoFilter
        :categories="todoStore.categories"
        :category-id="selectedCategoryId"
        :priority="selectedPriority"
        :due-date="selectedDueDate"
        @update:category-id="selectedCategoryId = $event"
        @update:priority="selectedPriority = $event"
        @update:due-date="selectedDueDate = $event"
        @create-category="handleCreateCategory"
      />
      <TodoInput @add="handleAddTodo" />
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
