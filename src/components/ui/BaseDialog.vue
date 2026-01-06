<script setup lang="ts">
import { onUnmounted, watch } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

const props = defineProps<{
  modelValue: boolean
  title?: string
  width?: string
  closeOnBackdrop?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const close = () => {
  emit('update:modelValue', false)
  emit('close')
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop !== false) close()
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  },
)

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <transition name="dialog">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="handleBackdropClick"
        ></div>

        <div
          class="relative bg-white rounded-xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden transition-all"
          :class="width || 'max-w-md'"
        >
          <div
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50"
          >
            <h3 class="text-lg font-bold text-gray-800">
              <slot name="title">{{ title || '提示' }}</slot>
            </h3>

            <button
              @click="close"
              class="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition"
            >
              <font-awesome-icon :icon="faXmark" />
            </button>
          </div>

          <div class="p-6 overflow-y-auto custom-scrollbar">
            <slot></slot>
          </div>

          <div
            v-if="$slots.footer"
            class="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3"
          >
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.2s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-active .bg-white,
.dialog-leave-active .bg-white {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dialog-enter-from .bg-white,
.dialog-leave-to .bg-white {
  opacity: 0;
  /* 這裡的 transform 是動畫用的，不會影響靜態顯示 */
  transform: scale(0.95) translateY(10px);
}
</style>
