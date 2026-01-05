import { reactive } from 'vue'

interface DialogOptions {
  confirmText?: string
  cancelText?: string
  html?: boolean // 👈 1. 確認介面有定義這個
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export const dialogState = reactive({
  isOpen: false,
  title: '',
  content: '',
  confirmText: '確認',
  cancelText: '取消',
  html: false, // 👈 2. 確認狀態有這個預設值
  type: 'confirm' as 'confirm' | 'alert',
  resolve: null as ((value: boolean) => void) | null,
  onConfirm: null as (() => void | Promise<void>) | null,
  onCancel: null as (() => void) | null,
})

export const simpleDialog = {
  confirm(title: string, content: string, options?: DialogOptions): Promise<boolean> {
    dialogState.title = title
    dialogState.content = content
    dialogState.confirmText = options?.confirmText || '確認'
    dialogState.cancelText = options?.cancelText || '取消'

    // 👇👇👇 3. 關鍵！這裡必須把 options.html 設定進去 state
    dialogState.html = options?.html || false

    dialogState.type = 'confirm'
    dialogState.onConfirm = options?.onConfirm || null
    dialogState.onCancel = options?.onCancel || null
    dialogState.isOpen = true

    return new Promise((resolve) => {
      dialogState.resolve = resolve
    })
  },

  // ... 其他部分 (alert, _close) 保持不變
  alert(title: string, content: string, options?: DialogOptions): Promise<boolean> {
    return this.confirm(title, content, {
      ...options,
      confirmText: options?.confirmText || '知道了',
      cancelText: '',
    }).then(() => true)
  },

  _close(result: boolean) {
    dialogState.isOpen = false
    if (result && dialogState.onConfirm) dialogState.onConfirm()
    else if (!result && dialogState.onCancel) dialogState.onCancel()

    if (dialogState.resolve) {
      dialogState.resolve(result)
      dialogState.resolve = null
    }
    dialogState.onConfirm = null
    dialogState.onCancel = null
  },
}

export default {
  install(app: any) {
    app.config.globalProperties.$simpleDialog = simpleDialog
    app.provide('$simpleDialog', simpleDialog)
  },
}
