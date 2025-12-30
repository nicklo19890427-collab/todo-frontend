<script setup lang="ts">
import { ref } from 'vue'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import BaseButton from '@/components/ui/BaseButton.vue'

const title = ref('')
const emit = defineEmits<{ (e: 'add', title: string): void }>()

const handleSubmit = () => {
  if (!title.value.trim()) return
  emit('add', title.value)
  title.value = ''
}
</script>

<template>
  <div
    class="bg-white p-2 rounded-2xl shadow-lg mb-8 border border-gray-100 flex items-center gap-2"
  >
    <input
      v-model="title"
      type="text"
      placeholder="今天想要完成什麼？..."
      class="flex-1 px-6 py-4 bg-transparent outline-none text-gray-700 text-lg placeholder-gray-400"
      autofocus
    />
    <BaseButton size="md" :icon="faPlus" @click="handleSubmit">
      <span class="hidden sm:inline">新增</span>
    </BaseButton>
  </div>
</template>
