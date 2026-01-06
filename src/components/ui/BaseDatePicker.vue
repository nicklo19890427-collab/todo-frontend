<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueDatePicker } from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCalendarDays, faXmark, faCheck } from '@fortawesome/free-solid-svg-icons' // ✨ 加入 check icon

const props = defineProps<{
  modelValue: string | null
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | null): void
}>()

const isOpen = ref(false)

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

const format = (date: Date) => {
  const Y = date.getFullYear()
  const M = (date.getMonth() + 1).toString().padStart(2, '0')
  const D = date.getDate().toString().padStart(2, '0')
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${Y}/${M}/${D} ${h}:${m}`
}
</script>

<template>
  <div class="w-full">
    <VueDatePicker
      v-model="dateValue"
      v-model:open="isOpen"
      teleport="body"
      :enable-time-picker="true"
      :is-24="true"
      :format="format"
    >
      <template #trigger>
        <div
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

      <template #action-buttons="{ selectDate }">
        <div class="flex justify-end gap-2 w-full font-medium">
          <button
            @click="isOpen = false"
            class="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition"
          >
            取消
          </button>
          <button
            @click="selectDate"
            class="px-3 py-1.5 text-sm bg-emerald-500 text-white hover:bg-emerald-600 rounded-md transition flex items-center gap-1"
          >
            <font-awesome-icon :icon="faCheck" class="text-xs" />
            確認
          </button>
        </div>
      </template>
    </VueDatePicker>
  </div>
</template>

<style scoped>
.input-base {
  @apply bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:border-emerald-400 transition py-2;
}
</style>
