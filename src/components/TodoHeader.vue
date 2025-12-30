<script setup lang="ts">
import { faClipboardList, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import BaseButton from '@/components/ui/BaseButton.vue'

defineProps<{ username: string }>()
const emit = defineEmits<{ (e: 'logout'): void }>()
</script>

<template>
  <header
    class="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
  >
    <div>
      <h1 class="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <font-awesome-icon :icon="faClipboardList" class="text-emerald-500" />
        我的待辦清單
      </h1>
      <p class="text-gray-500 text-sm mt-1 ml-8">
        Hi, <span class="font-bold text-emerald-600">{{ username }}</span>
      </p>
    </div>
    <BaseButton variant="ghost" :icon="faRightFromBracket" @click="emit('logout')">
      登出
    </BaseButton>
  </header>
</template>
