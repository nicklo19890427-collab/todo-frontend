<script setup lang="ts">
import { useRouter } from 'vue-router' // ✨ Import
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRightFromBracket, faListCheck, faGear } from '@fortawesome/free-solid-svg-icons' // ✨ faGear

defineProps<{ username: string }>()
defineEmits<{ (e: 'logout'): void }>() // create-category 移除了

const router = useRouter() // ✨
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
      <button
        @click="router.push('/settings')"
        class="flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition font-medium"
      >
        <span>設定</span>
        <font-awesome-icon :icon="faGear" />
      </button>

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
