/// <reference types="vite/client" />

// ✨ 擴充 Vue 的全域型別
import { simpleDialog } from '@/plugins/simpleDialog'

declare module 'vue' {
  interface ComponentCustomProperties {
    $simpleDialog: typeof simpleDialog
  }
}
