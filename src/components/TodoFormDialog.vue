<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { faCheck, faTag, faCalendarDays, faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Todo, Category } from '@/types'
import { getIconByName } from '@/utils/categoryIcons'

import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'

const props = defineProps<{
  modelValue: boolean
  todo?: Todo | null // 如果有傳入 todo 代表是編輯模式
  categories: Category[]
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (
    e: 'submit',
    payload: { title: string; categoryId?: number; priority?: string; dueDate?: string },
  ): void
}>()

// 表單狀態
const title = ref('')
const selectedCategoryId = ref<number | ''>('')
const selectedPriority = ref('LOW')
const selectedDueDate = ref('')

const isEditMode = computed(() => !!props.todo)

// 選項設定
const priorityOptions = [
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

const categoryOptions = computed(() => {
  return props.categories.map((c) => ({
    value: c.id,
    label: c.name,
    icon: getIconByName(c.icon),
  }))
})

// 當彈窗開啟或 todo 改變時，初始化表單
watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      if (props.todo) {
        // 編輯模式：帶入現有資料
        title.value = props.todo.title
        selectedCategoryId.value = props.todo.category?.id || ''
        selectedPriority.value = props.todo.priority
        selectedDueDate.value = props.todo.dueDate || ''
      } else {
        // 新增模式：重置表單
        title.value = ''
        selectedCategoryId.value = ''
        selectedPriority.value = 'LOW'
        selectedDueDate.value = ''
      }
    }
  },
)

const handleSubmit = () => {
  if (!title.value.trim()) return

  emit('submit', {
    title: title.value,
    categoryId: selectedCategoryId.value === '' ? undefined : Number(selectedCategoryId.value),
    priority: selectedPriority.value,
    dueDate: selectedDueDate.value || undefined,
  })

  // 關閉彈窗
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :title="isEditMode ? '編輯待辦事項' : '新增待辦事項'"
  >
    <div class="flex flex-col gap-5 py-2">
      <div>
        <label class="text-sm font-medium text-gray-700 mb-1 block">任務名稱</label>
        <BaseInput
          v-model="title"
          placeholder="請輸入任務名稱..."
          autofocus
          class="text-lg"
          @keyup-enter="handleSubmit"
        />
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
            <font-awesome-icon :icon="faTag" /> 分類
          </label>
          <BaseSelect
            v-model="selectedCategoryId"
            :options="categoryOptions"
            placeholder="選擇分類"
            class="w-full"
          />
        </div>

        <div>
          <label class="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
            <font-awesome-icon :icon="faLayerGroup" /> 優先級
          </label>
          <BaseSelect v-model="selectedPriority" :options="priorityOptions" class="w-full" />
        </div>

        <div class="sm:col-span-2">
          <label class="text-xs font-medium text-gray-500 mb-1 flex items-center gap-1">
            <font-awesome-icon :icon="faCalendarDays" /> 截止時間
          </label>
          <BaseDatePicker
            v-model="selectedDueDate"
            placeholder="設定截止時間 (選填)"
            class="w-full"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <BaseButton variant="ghost" @click="emit('update:modelValue', false)"> 取消 </BaseButton>
      <BaseButton variant="primary" :icon="faCheck" @click="handleSubmit" :disabled="!title.trim()">
        {{ isEditMode ? '儲存變更' : '新增任務' }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>
