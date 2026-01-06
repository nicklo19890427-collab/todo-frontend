<script setup lang="ts">
import { ref, computed } from 'vue'
import { faFilter, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Category } from '@/types'

import BaseButton from '@/components/ui/BaseButton.vue'
import TodoSearchDialog from '@/components/TodoSearchDialog.vue'

const props = defineProps<{
  categories: Category[]
  // 接收所有篩選條件
  keyword: string
  categoryId: number | ''
  priority: string
  dueDate: string
}>()

const emit = defineEmits<{
  (e: 'update:keyword', value: string): void
  (e: 'update:categoryId', value: number | ''): void
  (e: 'update:priority', value: string): void
  (e: 'update:dueDate', value: string): void
}>()

const isDialogOpen = ref(false)

// 計算目前有多少個活躍的篩選條件 (用來顯示 badge)
const activeFilterCount = computed(() => {
  let count = 0
  if (props.keyword) count++
  if (props.categoryId !== '') count++
  if (props.priority !== 'ALL') count++
  if (props.dueDate) count++
  return count
})

// 處理 Dialog 傳回來的整包篩選資料
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
      class="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-100 shadow-sm"
    >
      <div class="flex items-center gap-3 px-2 text-gray-500 text-sm flex-1">
        <font-awesome-icon :icon="faMagnifyingGlass" />
        <span v-if="keyword" class="text-gray-900 font-medium">{{ keyword }}</span>
        <span v-else class="text-gray-400">點擊右側按鈕進行搜尋與篩選...</span>
      </div>

      <BaseButton
        variant="secondary"
        @click="isDialogOpen = true"
        class="relative flex items-center gap-2 !py-2 !px-4"
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

    <TodoSearchDialog
      v-model="isDialogOpen"
      :categories="categories"
      :filters="{ keyword, categoryId, priority, dueDate }"
      @apply="handleApply"
    />
  </div>
</template>
