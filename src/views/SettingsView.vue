<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faArrowLeft, faCheck, faFolderPlus } from '@fortawesome/free-solid-svg-icons'
import { useTodoStore } from '@/stores/todo'
import { AVAILABLE_ICONS } from '@/utils/categoryIcons'
import BaseInput from '@/components/ui/BaseInput.vue'
import BaseButton from '@/components/ui/BaseButton.vue'

const router = useRouter()
const todoStore = useTodoStore()

const newCategoryName = ref('')
const selectedIcon = ref('folder') // 預設選中 folder
const isLoading = ref(false)

const handleCreate = async () => {
  if (!newCategoryName.value.trim()) return
  isLoading.value = true
  try {
    // 這裡需要去 store/todo.ts 讓 addCategory 支援第二個參數 (icon)，稍後修改
    await todoStore.addCategory(newCategoryName.value, selectedIcon.value)
    newCategoryName.value = ''
    selectedIcon.value = 'folder'
    alert('分類建立成功！')
  } catch (e) {
    alert('建立失敗')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center gap-4 mb-6">
        <button
          @click="router.back()"
          class="p-2 hover:bg-gray-200 rounded-full transition text-gray-600"
        >
          <font-awesome-icon :icon="faArrowLeft" />
        </button>
        <h1 class="text-2xl font-bold text-gray-800">設定</h1>
      </div>

      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
          <div class="bg-blue-100 p-2 rounded-lg text-blue-600">
            <font-awesome-icon :icon="faFolderPlus" />
          </div>
          <h2 class="text-lg font-semibold text-gray-700">新增分類</h2>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">分類名稱</label>
            <BaseInput v-model="newCategoryName" placeholder="例如：健身、閱讀..." />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-3">選擇圖示</label>
            <div class="grid grid-cols-5 sm:grid-cols-8 gap-3">
              <div
                v-for="item in AVAILABLE_ICONS"
                :key="item.name"
                @click="selectedIcon = item.name"
                class="aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer border-2 transition hover:bg-gray-50"
                :class="
                  selectedIcon === item.name
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                    : 'border-transparent text-gray-400'
                "
              >
                <font-awesome-icon :icon="item.icon" class="text-xl mb-1" />
              </div>
            </div>
          </div>

          <div class="pt-2">
            <BaseButton
              variant="primary"
              class="w-full justify-center"
              :disabled="!newCategoryName.trim() || isLoading"
              @click="handleCreate"
            >
              <font-awesome-icon :icon="faCheck" class="mr-2" />
              建立分類
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
