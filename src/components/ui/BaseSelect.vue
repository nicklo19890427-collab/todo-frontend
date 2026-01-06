<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue' // ✨ 加入 nextTick
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'

export interface SelectOption {
  value: string | number
  label: string
  color?: string
  icon?: object
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
// ✨ 新增：用來儲存計算後的座標樣式
const dropdownStyle = ref<Record<string, string>>({})

const selectedLabel = computed(() => {
  const selected = props.options.find((opt) => opt.value === props.modelValue)
  return selected ? selected.label : props.placeholder || '請選擇'
})

// ✨ 新增：計算座標的函式
const updatePosition = () => {
  if (!containerRef.value) return
  const rect = containerRef.value.getBoundingClientRect()

  dropdownStyle.value = {
    position: 'fixed', // 改用 fixed
    top: `${rect.bottom + 4}px`, // 距離底部 4px
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    zIndex: '9999', // 確保在最上層 (比 Dialog 高)
  }
}

// ✨ 修改：toggle 加入座標計算
const toggle = async () => {
  if (isOpen.value) {
    isOpen.value = false
  } else {
    isOpen.value = true
    await nextTick() // 等待 DOM 更新
    updatePosition() // 計算位置
  }
}

const selectOption = (value: string | number) => {
  emit('update:modelValue', value)
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  // ✨ 修改：因為 ul 被 teleport 走了，所以要檢查點擊目標是否既不在 container 也不在 dropdown 內
  // 但因為我們點選 dropdown item 就會關閉，所以只要檢查 container 就足夠覆蓋大部分情況
  // 為了保險，可以在 ul 上加個 ref 檢查，不過這裡簡化處理：
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    // 這裡有個小技巧：如果 dropdown 也在 body，click outside 邏輯可能會變複雜
    // 簡單解法：我們讓 dropdown 內的點擊事件不要冒泡，或者在 selectOption 裡已經處理了關閉
    isOpen.value = false
  }
}

// ✨ 新增：監聽視窗捲動或縮放，自動關閉選單 (避免選單飄浮在半空中)
const handleScrollOrResize = () => {
  if (isOpen.value) isOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  window.addEventListener('scroll', handleScrollOrResize, true) // true 代表捕獲階段，可以監聽所有捲動
  window.addEventListener('resize', handleScrollOrResize)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', handleScrollOrResize, true)
  window.removeEventListener('resize', handleScrollOrResize)
})
</script>

<template>
  <div ref="containerRef" class="relative select-none">
    <div
      @click.stop="toggle"
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

    <Teleport to="body">
      <transition name="dropdown">
        <ul
          v-if="isOpen"
          :style="dropdownStyle"
          @click.stop
          class="absolute z-50 mt-1 bg-white border border-gray-100 rounded-lg shadow-xl max-h-60 overflow-auto py-1 focus:outline-none text-sm"
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
    </Teleport>
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
