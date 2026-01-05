<script setup lang="ts">
import { computed } from 'vue'
import {
  faFolderOpen,
  faFire,
  faBolt,
  faMugHot,
  // faPlus, faCheck, faXmark 移除了
} from '@fortawesome/free-solid-svg-icons'
import type { Category } from '@/types'
import { getIconByName } from '@/utils/categoryIcons'

import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
// BaseButton, BaseInput 移除了

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
  // create-category 移除了
}>()

const categoryOptions = computed(() => {
  return props.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: getIconByName(cat.icon), // ✨ 加入這行：把字串轉成 Icon 物件
  }))
})

const priorityOptions = [
  { value: 'ALL', label: '全部' },
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

const priorityConfig = computed(() => {
  switch (props.priority) {
    case 'HIGH':
      return { icon: faFire, class: 'text-red-500' }
    case 'MEDIUM':
      return { icon: faBolt, class: 'text-amber-500' }
    case 'LOW':
      return { icon: faMugHot, class: 'text-blue-500' }
    case 'ALL':
    default:
      return { icon: undefined, class: '' }
  }
})
</script>

<template>
  <div class="flex flex-wrap items-center gap-3 mb-3 px-2">
    <BaseSelect
      :model-value="categoryId"
      @update:model-value="emit('update:categoryId', $event === '' ? '' : Number($event))"
      :options="categoryOptions"
      :icon="faFolderOpen"
      placeholder="所有分類"
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
      placeholder="篩選日期"
    />
  </div>
</template>
