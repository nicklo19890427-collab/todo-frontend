<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export interface SelectOption {
  value: string | number
  label: string
  color?: string
  icon?: object // ✨ 新增：選項可以有 Icon
}

const props = defineProps<{
  modelValue: string | number | ''
  options: SelectOption[]
  icon?: object
  iconClass?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
}>()

const isOpen = ref(false)
const containerRef = ref<HTMLElement | null>(null)

// 計算選中的標籤 (這裡也可以改為顯示選中的 Icon，但為了簡潔我們先保持顯示文字)
const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder || '請選擇'
})

const toggle = () => (isOpen.value = !isOpen.value)
const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
  isOpen.value = false
}
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<template>
  <div ref="containerRef" class="relative select-none">
    <div
      @click="toggle"
      class="input-base flex items-center justify-between cursor-pointer"
      :class="{
        'pl-9': icon,
        'pl-3': !icon,
        'pr-3': true,
        'ring-2 ring-emerald-100 border-emerald-500': isOpen,
      }"
    >
      <div
        v-if="icon"
        class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none"
        :class="iconClass || 'text-gray-400'"
      >
        <font-awesome-icon :icon="icon" class="text-sm" />
      </div>

      <span :class="modelValue === '' ? 'text-gray-400' : 'text-gray-700'">
        {{ selectedLabel }}
      </span>

      <font-awesome-icon
        :icon="faChevronDown"
        class="text-gray-400 text-xs transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </div>

    <transition name="dropdown">
      <ul
        v-if="isOpen"
        class="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-auto py-1 focus:outline-none text-sm"
      >
        <li
          v-if="placeholder"
          @click="selectOption('')"
          class="px-3 py-2 text-gray-400 cursor-pointer hover:bg-gray-50 transition"
        >
          {{ placeholder }}
        </li>

        <li
          v-for="opt in options"
          :key="opt.value"
          @click="selectOption(opt.value)"
          class="px-3 py-2 cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 transition flex items-center justify-between"
          :class="{ 'bg-emerald-50 text-emerald-700 font-medium': modelValue === opt.value }"
        >
          <div class="flex items-center gap-2">
            <font-awesome-icon
              v-if="opt.icon"
              :icon="opt.icon"
              class="text-gray-400 w-4 text-center"
              :class="{ 'text-emerald-600': modelValue === opt.value }"
            />
            <span>{{ opt.label }}</span>
          </div>

          <span v-if="modelValue === opt.value" class="text-emerald-500">•</span>
        </li>

        <li v-if="options.length === 0" class="px-3 py-2 text-center text-gray-400 text-xs">
          沒有選項
        </li>
      </ul>
    </transition>
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";
.input-base {
  @apply bg-white border border-gray-300 text-gray-700 text-sm rounded-lg hover:border-emerald-400 transition py-2;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
