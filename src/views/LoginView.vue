<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// 狀態管理
const isRegisterMode = ref(false) // 切換登入/註冊模式
const isLoading = ref(false) // 防止重複點擊
const errorMsg = ref('')

// 表單資料
const form = ref({
  username: '',
  password: '',
})

// 切換 登入/註冊 模式
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  errorMsg.value = '' // 切換時清空錯誤訊息
}

// 處理送出
const handleSubmit = async () => {
  // 1. 基本檢查
  errorMsg.value = ''
  if (!form.value.username || !form.value.password) {
    errorMsg.value = '請輸入完整資訊'
    return
  }

  isLoading.value = true

  try {
    if (isRegisterMode.value) {
      // --- 註冊模式 ---
      await authStore.register(form.value.username, form.value.password)
      alert('註冊成功！請登入')
      // 註冊成功後，自動切換回登入模式，並清空密碼
      isRegisterMode.value = false
      form.value.password = ''
    } else {
      // --- 登入模式 ---
      await authStore.login(form.value.username, form.value.password)
      // 登入成功後，Store 裡的 router.push('/') 會自動跳轉，這裡不用寫
    }
  } catch (err: any) {
    // 顯示錯誤訊息 (來自 Store 拋出的 error)
    errorMsg.value = err.message || '發生錯誤，請稍後再試'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 px-4"
  >
    <div
      class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md transition-all duration-300 hover:shadow-2xl"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-gray-800 tracking-tight">
          {{ isRegisterMode ? '建立新帳號' : '歡迎回來' }}
        </h1>
        <p class="text-gray-500 mt-2 text-sm">
          {{ isRegisterMode ? '加入我們，開始管理你的待辦事項' : '請輸入您的帳號密碼以繼續' }}
        </p>
      </div>

      <div class="space-y-5">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">使用者名稱</label>
          <input
            v-model="form.username"
            type="text"
            placeholder="例如: user123"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-gray-50 focus:bg-white"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="••••••••"
            @keyup.enter="handleSubmit"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <div
        v-if="errorMsg"
        class="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2 animate-pulse"
      >
        ⚠️ {{ errorMsg }}
      </div>

      <button
        @click="handleSubmit"
        :disabled="isLoading"
        class="w-full mt-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transform active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        <span v-if="isLoading" class="animate-spin">⏳</span>
        {{ isRegisterMode ? '立即註冊' : '登入系統' }}
      </button>

      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          {{ isRegisterMode ? '已經有帳號了？' : '還沒有帳號嗎？' }}
          <span
            @click="toggleMode"
            class="text-emerald-600 font-bold cursor-pointer hover:underline hover:text-emerald-700 ml-1 transition"
          >
            {{ isRegisterMode ? '直接登入' : '免費註冊' }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
