import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth' // 引入我們等一下要確認的狀態管理
// 引入頁面元件 (我們下一步會建立這些檔案)
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  // 使用 HTML5 的 History 模式 (網址看起來很乾淨，沒有 #)
  history: createWebHistory(import.meta.env.BASE_URL),

  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      // ✨ 關鍵設定：標記這個路由「需要登入」才能看
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
  ],
})

// --- 路由守衛 (Navigation Guard) ---
// 每次換頁之前，Router 都會跑這一段檢查
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // 1. 檢查這個頁面是否需要權限 (meta.requiresAuth)
  // 2. 檢查使用者是否還沒登入 (!authStore.isAuthenticated)
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // 如果這兩點都符合，就把他踢去登入頁
    next('/login')
  } else {
    // 否則就放行
    next()
  }
})

export default router
