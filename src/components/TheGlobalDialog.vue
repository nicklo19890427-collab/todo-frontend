<script setup lang="ts">
import { computed } from 'vue'
import BaseDialog from '@/components/ui/BaseDialog.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { dialogState, simpleDialog } from '@/plugins/simpleDialog'

const handleCancel = () => {
  simpleDialog._close(false)
}

const handleConfirm = () => {
  simpleDialog._close(true)
}

const showCancel = computed(() => !!dialogState.cancelText)
</script>

<template>
  <BaseDialog v-model="dialogState.isOpen" :close-on-backdrop="true" @close="handleCancel">
    <template #title>
      <span v-if="dialogState.html" v-html="dialogState.title"></span>
      <span v-else>{{ dialogState.title }}</span>
    </template>

    <div
      v-if="dialogState.html"
      class="text-gray-600 whitespace-pre-line leading-relaxed content-html"
      v-html="dialogState.content"
    ></div>

    <div v-else class="text-gray-600 whitespace-pre-line leading-relaxed">
      {{ dialogState.content }}
    </div>

    <template #footer>
      <BaseButton v-if="showCancel" variant="ghost" @click="handleCancel">
        {{ dialogState.cancelText }}
      </BaseButton>

      <BaseButton variant="primary" @click="handleConfirm">
        {{ dialogState.confirmText }}
      </BaseButton>
    </template>
  </BaseDialog>
</template>

<style scoped>
/* 讓插入的 HTML 內容有一些基本樣式 */
.content-html :deep(b),
.content-html :deep(strong) {
  font-weight: 600;
  color: #111827;
}
</style>
