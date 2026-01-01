<script setup lang="ts">
import { ref, computed } from 'vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import type { Category } from '@/types'

import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
// ✨ 新增：引入日期選擇器
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'

const props = defineProps<{
  categories: Category[]
}>()

// ✨ 修改：emit 增加 dueDate
const emit = defineEmits<{
  (
    e: 'add',
    payload: { title: string; categoryId?: number; priority?: string; dueDate?: string },
  ): void
}>()

const title = ref('')
const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('LOW')
const selectedDueDate = ref('') // ✨ 新增：日期狀態

const priorityOptions = [
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

const categoryOptions = computed(() => {
  return props.categories.map((c) => ({
    value: c.id,
    label: c.name,
  }))
})

const handleAdd = () => {
  if (!title.value.trim()) return

  emit('add', {
    title: title.value,
    categoryId: selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value),
    priority: selectedPriority.value,
    dueDate: selectedDueDate.value || undefined, // ✨ 傳出日期
  })

  // 重置所有欄位
  title.value = ''
  selectedCategoryId.value = ''
  selectedPriority.value = 'LOW'
  selectedDueDate.value = '' // ✨ 重置日期
}
</script>

<template>
  <div
    class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 transition-all hover:shadow-md"
  >
    <div class="flex flex-col gap-3">
      <BaseInput
        v-model="title"
        placeholder="今天想要完成什麼？..."
        autofocus
        @keyup-enter="handleAdd"
        class="text-lg"
      />

      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2">
          <BaseSelect
            v-model="selectedCategoryId"
            :options="categoryOptions"
            placeholder="選擇分類"
            class="w-32"
          />

          <BaseSelect v-model="selectedPriority" :options="priorityOptions" class="w-24" />

          <BaseDatePicker v-model="selectedDueDate" placeholder="截止時間" />
        </div>

        <BaseButton variant="primary" :icon="faPlus" @click="handleAdd" :disabled="!title.trim()">
          新增
        </BaseButton>
      </div>
    </div>
  </div>
</template>
