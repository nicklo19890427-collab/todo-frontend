<script setup lang="ts">
import { computed } from 'vue'
import { DatePicker as VDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendarDays, faXmark } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  modelValue: string | null
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const dateValue = computed({
  get: () => (props.modelValue ? new Date(props.modelValue) : null),
  set: (val: Date | null) => {
    if (!val) {
      emit('update:modelValue', null)
      return
    }
    const Y = val.getFullYear()
    const M = (val.getMonth() + 1).toString().padStart(2, '0')
    const D = val.getDate().toString().padStart(2, '0')
    const h = val.getHours().toString().padStart(2, '0')
    const m = val.getMinutes().toString().padStart(2, '0')
    const s = '00'

    emit('update:modelValue', `${Y}-${M}-${D}T${h}:${m}:${s}`)
  },
})

const displayValue = computed(() => {
  if (!props.modelValue) return props.placeholder || '選擇時間'
  const date = new Date(props.modelValue)
  if (isNaN(date.getTime())) return props.placeholder

  const Y = date.getFullYear()
  const M = (date.getMonth() + 1).toString().padStart(2, '0')
  const D = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')

  return `${Y}/${M}/${D} ${h}:${m}`
})

const onDayClick = (_: any, event: MouseEvent) => {
  const target = event.target as HTMLElement
  target?.blur()
}
</script>

<template>
  <div class="w-48">
    <VDatePicker
      v-model="dateValue"
      mode="dateTime"
      color="emerald"
      is24hr
      hide-time-header
      @dayclick="onDayClick"
    >
      <template #default="{ togglePopover }">
        <div
          @click="togglePopover"
          class="input-base flex items-center justify-between cursor-pointer pl-9 pr-3 relative group"
        >
          <div
            class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"
          >
            <font-awesome-icon :icon="faCalendarDays" class="text-sm" />
          </div>

          <span
            :class="modelValue ? 'text-gray-900 font-medium' : 'text-gray-400'"
            class="truncate"
          >
            {{ displayValue }}
          </span>

          <div
            v-if="modelValue"
            @click.stop="emit('update:modelValue', null)"
            class="absolute inset-y-0 right-0 pr-2 flex items-center text-gray-400 hover:text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition"
          >
            <font-awesome-icon :icon="faXmark" class="text-xs" />
          </div>
        </div>
      </template>
    </VDatePicker>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";

.input-base {
  @apply bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:border-emerald-400 transition py-2;
}

/* ✨ 新增：解決 V-Calendar 被選取日期背景消失的問題 */
/* 使用 :deep() 穿透元件 scoped 限制，強制設定選取狀態的樣式 */
:deep(.vc-day-content.vc-highlight-content-solid) {
  background-color: #10b981 !important; /* emerald-500 */
  color: #ffffff !important;
}

/* 滑鼠懸停時的效果 */
:deep(.vc-day-content.vc-highlight-content-solid:hover) {
  background-color: #059669 !important; /* emerald-600 */
}
</style>
