<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

defineProps<{
  modelValue: string | number
  type?: string
  placeholder?: string
  icon?: object
  autofocus?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()
</script>

<template>
  <div class="relative">
    <div
      v-if="icon"
      class="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-gray-400"
    >
      <font-awesome-icon :icon="icon" class="text-sm" />
    </div>
    <input
      :type="type || 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :autofocus="autofocus"
      class="input-base w-full"
      :class="{ 'pl-9': icon, 'pl-3': !icon }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<style scoped>
@reference "@/assets/main.css";
.input-base {
  @apply appearance-none bg-white border border-gray-300 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block py-2 outline-none hover:bg-gray-50 transition;
}
</style>
