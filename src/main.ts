import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'
import App from './App.vue'
import router from './router'
// --- ✨ 1. 引入 FontAwesome 核心與元件 ---
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
/* --- ✨ 新增 V-Calendar 設定 --- */
import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

// ✨ 引入我們剛寫好的 Plugin
import SimpleDialogPlugin from '@/plugins/simpleDialog'
const app = createApp(App)

/* --- ✨ 註冊 V-Calendar --- */
app.use(VCalendar, {})
app.use(createPinia())
app.use(router)
// 註冊全域元件 <font-awesome-icon> (這樣你在任何頁面都可以用這個標籤)
app.component('font-awesome-icon', FontAwesomeIcon)
/* --- ✨ FontAwesome 設定結束 --- */
// ✨ 安裝 Plugin
app.use(SimpleDialogPlugin)
app.mount('#app')
