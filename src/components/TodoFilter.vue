<script setup lang="ts">
import { ref, computed } from 'vue'
import { faFilter, faMagnifyingGlass, faSort } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Category } from '@/types'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue' // ✨ 引入 BaseSelect
import TodoSearchDialog from '@/components/TodoSearchDialog.vue'

const props = defineProps<{
  categories: Category[]
  keyword: string
  categoryId: number | ''
  priority: string
  dueDate: string
  // ✨ 新增 props 接收排序狀態
  sortBy: string
  direction: string
}>()

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void
  (e: 'update:categoryId', value: number | ''): void
  (e: 'update:priority', value: string): void
  (e: 'update:dueDate', value: string): void
  // ✨ 新增排序 emits
  (e: 'update:sortBy', value: string): void
  (e: 'update:direction', value: string): void
}>()

const isDialogOpen = ref(false)

const activeFilterCount = computed(() => {
  let count = 0
  if (props.keyword) count++
  if (props.categoryId !== '') count++
  if (props.priority !== 'ALL') count++
  if (props.dueDate) count++
  return count
})

// ✨ 定義快速排序選項
// 我們將 sortBy 和 direction 綁定在一個 value 字串中，方便 BaseSelect 使用
const sortOptions = [
  { value: 'priority_desc', label: '優先級 (高 → 低)' },
  { value: 'priority_asc', label: '優先級 (低 → 高)' },
  { value: 'dueDate_asc', label: '到期日 (近 → 遠)' },
  { value: 'dueDate_desc', label: '到期日 (遠 → 近)' },
  { value: 'id_desc', label: '建立時間 (新 → 舊)' },
]

// 計算目前的排序組合字串
const currentSort = computed({
  get: () => `${props.sortBy}_${props.direction}`,
  set: (val) => {
    const [field, dir] = val.split('_')
    emit('update:sortBy', field)
    emit('update:direction', dir)
  },
})

const handleApply = (filters: {
  keyword: string
  categoryId: number | ''
  priority: string
  dueDate: string
}) => {
  emit('update:keyword', filters.keyword)
  emit('update:categoryId', filters.categoryId)
  emit('update:priority', filters.priority)
  emit('update:dueDate', filters.dueDate)
}
</script>

<template>
  <div class="mb-4 px-2">
    <div
      class="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm gap-2"
    >
      <div class="flex items-center gap-3 px-2 text-gray-500 text-sm flex-1">
        <font-awesome-icon :icon="faMagnifyingGlass" />
        <span v-if="keyword" class="text-gray-900 font-medium">{{ keyword }}</span>
        <span v-else class="text-gray-400">點擊篩選進行搜尋...</span>
      </div>

      <div class="flex items-center gap-2">
        <BaseSelect
          v-model="currentSort"
          :options="sortOptions"
          :icon="faSort"
          placeholder="排序"
          class="w-44"
        />

        <BaseButton
          variant="secondary"
          @click="isDialogOpen = true"
          class="relative flex items-center gap-2 py-2 px-4 whitespace-nowrap"
        >
          <font-awesome-icon :icon="faFilter" />
          <span>篩選</span>

          <span
            v-if="activeFilterCount > 0"
            class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white"
          >
            {{ activeFilterCount }}
          </span>
        </BaseButton>
      </div>
    </div>

    <TodoSearchDialog
      v-model="isDialogOpen"
      :categories="categories"
      :filters="{ keyword, categoryId, priority, dueDate }"
      @apply="handleApply"
    />
  </div>
</template>
