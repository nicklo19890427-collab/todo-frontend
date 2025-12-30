<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type { Todo } from '@/types'
import {
  faSpinner,
  faLeaf,
  faCheck,
  faTag,
  faFire,
  faBolt,
  faMugHot,
  faCalendarDays,
  faPenToSquare,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps<{ todos: Todo[]; loading: boolean }>()
const emit = defineEmits<{
  (e: 'toggle', todo: Todo): void
  (e: 'delete', id: number): void
  (e: 'update', todo: Todo): void
}>()

const editingId = ref<number | null>(null)
const editingTitle = ref('')

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
const saveEdit = (todo: Todo) => {
  if (editingId.value !== todo.id) return
  const newTitle = editingTitle.value.trim()
  if (newTitle && newTitle !== todo.title) emit('update', { ...todo, title: newTitle })
  cancelEdit()
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'HIGH':
      return 'bg-red-50 text-red-600 border-red-100'
    case 'MEDIUM':
      return 'bg-amber-50 text-amber-600 border-amber-100'
    case 'LOW':
      return 'bg-blue-50 text-blue-600 border-blue-100'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
</script>

<template>
  <div v-if="loading" class="text-center py-12 text-gray-500 flex flex-col items-center">
    <font-awesome-icon :icon="faSpinner" class="fa-spin text-3xl text-emerald-500 mb-2" />
    <p>載入中...</p>
  </div>

  <ul v-else-if="todos.length > 0" class="space-y-3">
    <li
      v-for="todo in todos"
      :key="todo.id"
      class="group bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 flex items-center justify-between"
      :class="{ 'opacity-60 bg-gray-50': todo.completed }"
    >
      <div class="flex items-center gap-4 flex-1 overflow-hidden">
        <label class="relative flex items-center justify-center cursor-pointer p-2">
          <input
            type="checkbox"
            :checked="todo.completed"
            @change="emit('toggle', todo)"
            class="peer appearance-none w-6 h-6 border-2 border-gray-300 rounded-full checked:bg-emerald-500 checked:border-emerald-500 transition-colors"
          />
          <font-awesome-icon
            :icon="faCheck"
            class="absolute text-xs text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
          />
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
            class="text-lg text-gray-700 truncate cursor-pointer select-none"
            :class="{ 'line-through text-gray-400': todo.completed }"
            @dblclick="startEdit(todo)"
            >{{ todo.title }}</span
          >

          <div class="flex items-center gap-2 text-xs flex-wrap">
            <span
              v-if="todo.category"
              class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 font-medium"
            >
              <font-awesome-icon :icon="faTag" /> {{ todo.category.name }}
            </span>
            <span
              class="flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium"
              :class="getPriorityColor(todo.priority)"
            >
              <font-awesome-icon v-if="todo.priority === 'HIGH'" :icon="faFire" />
              <font-awesome-icon v-else-if="todo.priority === 'MEDIUM'" :icon="faBolt" />
              <font-awesome-icon v-else :icon="faMugHot" />
              {{ todo.priority === 'HIGH' ? '高' : todo.priority === 'MEDIUM' ? '中' : '低' }}
            </span>
            <span
              v-if="todo.dueDate"
              class="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-200"
            >
              <font-awesome-icon :icon="faCalendarDays" /> {{ todo.dueDate }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
        <BaseButton
          v-if="editingId !== todo.id"
          variant="ghost"
          class="text-gray-400 hover:text-blue-500"
          @click="startEdit(todo)"
        >
          <font-awesome-icon :icon="faPenToSquare" />
        </BaseButton>
        <BaseButton v-if="editingId !== todo.id" variant="danger" @click="emit('delete', todo.id)">
          <font-awesome-icon :icon="faTrashCan" />
        </BaseButton>
      </div>
    </li>
  </ul>

  <div v-else class="text-center py-16 text-gray-400">
    <font-awesome-icon :icon="faLeaf" class="text-6xl text-emerald-100 mb-4" />
    <h3 class="text-xl font-medium text-gray-600">目前沒有待辦事項</h3>
  </div>
</template>
