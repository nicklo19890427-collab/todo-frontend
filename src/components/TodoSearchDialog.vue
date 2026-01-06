<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  faFolderOpen,
  faFire,
  faBolt,
  faMugHot,
  faMagnifyingGlass,
  faFilter,
  faRotateLeft,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import type { Category } from '@/types'
import { getIconByName } from '@/utils/categoryIcons'

import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseSelect from '@/components/ui/BaseSelect.vue'
import BaseDatePicker from '@/components/ui/BaseDatePicker.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const props = defineProps<{
  modelValue: boolean
  categories: Category[]
  // 接收目前的篩選狀態
  filters: {
    keyword: string
    categoryId: number | ''
    priority: string
    dueDate: string
  }
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'apply', filters: typeof props.filters): void
}>()

// 本地暫存狀態 (避免使用者還沒按確認就直接改動外面的資料)
const localFilters = ref({ ...props.filters })

// 當 Dialog 開啟時，同步外部的狀態進來
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      localFilters.value = { ...props.filters }
    }
  },
)

// 分類選項
const categoryOptions = computed(() => {
  return props.categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
    icon: getIconByName(cat.icon),
  }))
})

// 優先級選項
const priorityOptions = [
  { value: 'ALL', label: '全部' },
  { value: 'LOW', label: '低' },
  { value: 'MEDIUM', label: '中' },
  { value: 'HIGH', label: '高' },
]

const priorityConfig = computed(() => {
  switch (localFilters.value.priority) {
    case 'HIGH':
      return { icon: faFire, class: 'text-red-500' }
    case 'MEDIUM':
      return { icon: faBolt, class: 'text-amber-500' }
    case 'LOW':
      return { icon: faMugHot, class: 'text-blue-500' }
    default:
      return { icon: undefined, class: '' }
  }
})

const handleReset = () => {
  localFilters.value = {
    keyword: '',
    categoryId: '',
    priority: 'ALL',
    dueDate: '',
  }
}

const handleApply = () => {
  emit('apply', { ...localFilters.value })
  emit('update:modelValue', false)
}
</script>

<template>
  <BaseDialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    title="搜尋與篩選"
    width="max-w-lg"
  >
    <div class="space-y-5 py-2">
      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">關鍵字</label>
        <BaseInput
          v-model="localFilters.keyword"
          placeholder="搜尋待辦事項..."
          :icon="faMagnifyingGlass"
          class="w-full"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">分類</label>
          <BaseSelect
            v-model="localFilters.categoryId"
            :options="categoryOptions"
            :icon="faFolderOpen"
            placeholder="所有分類"
            class="w-full"
          />
        </div>

        <div class="space-y-1">
          <label class="text-sm font-medium text-gray-700">優先級</label>
          <BaseSelect
            v-model="localFilters.priority"
            :options="priorityOptions"
            :icon="priorityConfig.icon"
            :icon-class="priorityConfig.class"
            class="w-full"
          />
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium text-gray-700">到期日</label>
        <BaseDatePicker v-model="localFilters.dueDate" placeholder="選擇日期" class="w-full" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between w-full">
        <BaseButton variant="secondary" @click="handleReset" class="flex items-center gap-2">
          <font-awesome-icon :icon="faRotateLeft" />
          重置
        </BaseButton>

        <div class="flex gap-2">
          <BaseButton variant="secondary" @click="emit('update:modelValue', false)">
            取消
          </BaseButton>
          <BaseButton variant="primary" @click="handleApply" class="flex items-center gap-2">
            <font-awesome-icon :icon="faFilter" />
            套用篩選
          </BaseButton>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>
