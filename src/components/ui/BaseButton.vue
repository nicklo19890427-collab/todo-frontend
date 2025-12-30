<script setup lang="ts">
import { computed } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = defineProps<{
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md'
  icon?: any
}>()

const btnClass = computed(() => {
  const base =
    'font-medium rounded-lg transition flex items-center justify-center gap-1.5 focus:outline-none active:scale-95'
  const sizes = props.size === 'sm' ? 'px-2 py-1 text-sm' : 'px-4 py-2 text-sm'
  const variants = {
    primary: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md border border-transparent',
    secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm',
    danger: 'bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 border border-transparent',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  }
  return `${base} ${sizes} ${variants[props.variant || 'primary']}`
})
</script>

<template>
  <button :class="btnClass">
    <font-awesome-icon v-if="icon" :icon="icon" />
    <slot />
  </button>
</template>
