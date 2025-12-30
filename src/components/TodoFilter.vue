<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  faFolderOpen,
  faFire,
  faBolt,
  faMugHot,
  faPlus,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import type { Category } from '@/types' // 移除沒用到的 FontAwesomeIcon 引入

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'

const props = defineProps<{
  categories: Category[]
  categoryId: number | ''
  priority: string
  dueDate: string
}>()

const emit = defineEmits<{
  (e: 'update:categoryId', value: number | ''): void
  (e: 'update:priority', value: string): void
  (e: 'update:dueDate', value: string): void
  (e: 'create-category', name: string): void
}>()

const isCreating = ref(false)
const newCategoryName = ref('')

const categoryOptions = computed(() => {
  return props.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))
})

const priorityOptions = [
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

// --- ✨ 新增：計算優先級的 Icon 和顏色 ---
const priorityConfig = computed(() => {
  switch (props.priority) {
    case 'HIGH':
      return { icon: faFire, class: 'text-red-500' }
    case 'MEDIUM':
      return { icon: faBolt, class: 'text-amber-500' }
    case 'LOW':
    default:
      return { icon: faMugHot, class: 'text-blue-500' }
  }
})

const handleCreate = () => {
  if (!newCategoryName.value.trim()) return
  emit('create-category', newCategoryName.value)
  newCategoryName.value = ''
  isCreating.value = false
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 mb-3 px-2">
    <BaseSelect
      :model-value="categoryId"
      @update:model-value="emit('update:categoryId', $event === '' ? '' : Number($event))"
      :options="categoryOptions"
      :icon="faFolderOpen"
      placeholder="未分類"
      class="w-36"
    />

    <BaseSelect
      :model-value="priority"
      @update:model-value="emit('update:priority', String($event))"
      :options="priorityOptions"
      :icon="priorityConfig.icon"
      :icon-class="priorityConfig.class"
      class="w-28"
    />

    <BaseDatePicker
      :model-value="dueDate"
      @update:model-value="emit('update:dueDate', $event || '')"
      placeholder="截止日期"
    />

    <div class="flex items-center gap-2 ml-auto">
      <BaseButton v-if="!isCreating" variant="ghost" :icon="faPlus" @click="isCreating = true">
        新增分類
      </BaseButton>
      <div v-else class="flex items-center gap-1 animate-fadeIn">
        <BaseInput
          v-model="newCategoryName"
          placeholder="分類名稱..."
          class="w-32"
          autofocus
          @keyup-enter="handleCreate"
        />
        <BaseButton
          size="sm"
          variant="ghost"
          class="text-emerald-600 hover:bg-emerald-100"
          @click="handleCreate"
        >
          <font-awesome-icon :icon="faCheck" />
        </BaseButton>
        <BaseButton size="sm" variant="ghost" class="text-gray-400" @click="isCreating = false">
          <font-awesome-icon :icon="faXmark" />
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
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
