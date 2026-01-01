<script setup lang="ts">
import { ref } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faRightFromBracket,
  faListCheck,
  faPlus,
  faCheck,
  faXmark,
} from '@fortawesome/free-solid-svg-icons'
import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

defineProps<{
  username: string
}>()

const emit = defineEmits<{
  (e: 'logout'): void
  (e: 'create-category', name: string): void // ✨ 新增事件
}>()

// ✨ 新增：控制分類輸入框的狀態
const isCreatingCategory = ref(false)
const newCategoryName = ref('')

const handleCreateCategory = () => {
  if (newCategoryName.value.trim()) {
    emit('create-category', newCategoryName.value)
    newCategoryName.value = ''
    isCreatingCategory.value = false
  }
}
</script>

<template>
  <header
    class="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100"
  >
    <div class="flex items-center gap-3">
      <div class="bg-emerald-100 p-2 rounded-lg text-emerald-600">
        <font-awesome-icon :icon="faListCheck" class="text-xl" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-gray-800">我的待辦清單</h1>
        <p class="text-xs text-gray-500">Hi, {{ username }}</p>
      </div>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2">
        <BaseButton
          v-if="!isCreatingCategory"
          size="sm"
          variant="ghost"
          :icon="faPlus"
          @click="isCreatingCategory = true"
          class="text-gray-500 hover:text-emerald-600"
        >
          新增分類
        </BaseButton>

        <div v-else class="flex items-center gap-1 animate-fadeIn">
          <BaseInput
            v-model="newCategoryName"
            placeholder="分類名稱"
            class="w-32"
            autofocus
            @keyup-enter="handleCreateCategory"
          />
          <button
            @click="handleCreateCategory"
            class="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded transition"
          >
            <font-awesome-icon :icon="faCheck" />
          </button>
          <button
            @click="isCreatingCategory = false"
            class="p-1.5 text-gray-400 hover:bg-gray-50 rounded transition"
          >
            <font-awesome-icon :icon="faXmark" />
          </button>
        </div>
      </div>

      <div class="h-6 w-px bg-gray-200"></div>
      <button
        @click="$emit('logout')"
        class="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition font-medium"
      >
        <span>登出</span>
        <font-awesome-icon :icon="faRightFromBracket" />
      </button>
    </div>
  </header>
</template>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>
