<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// --- 設定 API 基礎路徑 ---
// 注意：我們把網址切短一點，這樣方便後面接 /auth 或 /todos
// 如果是在 Vercel 環境，會自動讀取環境變數；本機開發則用 localhost:8080
const API_BASE = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/todos', '/api')
  : 'http://localhost:8080/api'

// --- 資料變數 ---
const todos = ref([])
const newTodoTitle = ref('')
const username = ref('')
const password = ref('')
const token = ref(localStorage.getItem('todo_token') || '') // 嘗試從瀏覽器暫存拿 Token
const currentUser = ref(localStorage.getItem('todo_username') || '')

// --- 功能 1: 登入 (Login) ---
const handleLogin = async () => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, {
      username: username.value,
      password: password.value
    })

    // 1. 登入成功，把 Token 和名字存起來
    const newToken = response.data.token
    const newUsername = response.data.username

    token.value = newToken
    currentUser.value = newUsername

    // 2. 存到瀏覽器 (localStorage)，這樣重新整理網頁才不會被登出
    localStorage.setItem('todo_token', newToken)
    localStorage.setItem('todo_username', newUsername)

    // 3. 清空輸入框並抓取資料
    username.value = ''
    password.value = ''
    fetchTodos()

  } catch (error) {
    alert('登入失敗！請檢查帳號密碼 (或是後端沒開？)')
    console.error(error)
  }
}

// --- 功能 2: 註冊 (Register) ---
const handleRegister = async () => {
  try {
    await axios.post(`${API_BASE}/auth/register`, {
      username: username.value,
      password: password.value
    })
    alert('註冊成功！請直接登入')
  } catch (error) {
    alert('註冊失敗：' + (error.response?.data || error.message))
  }
}

// --- 功能 3: 登出 (Logout) ---
const handleLogout = () => {
  token.value = ''
  currentUser.value = ''
  todos.value = []
  localStorage.removeItem('todo_token')
  localStorage.removeItem('todo_username')
}

// --- 取得 Header 的小工具 ---
// 每次發請求都要帶這個，不然會被後端擋下來
const getAuthHeader = () => {
  return {
    headers: { Authorization: `Bearer ${token.value}` }
  }
}

// --- 待辦事項 CRUD (都有加上 Header) ---
const fetchTodos = async () => {
  if (!token.value) return // 沒登入就不抓資料

  try {
    const response = await axios.get(`${API_BASE}/todos`, getAuthHeader())
    todos.value = response.data
  } catch (error) {
    console.error('抓取失敗:', error)
    if (error.response && error.response.status === 403) {
      handleLogout() // 如果 Token 過期失效，就強制登出
    }
  }
}

const addTodo = async () => {
  if (!newTodoTitle.value.trim()) return
  try {
    await axios.post(`${API_BASE}/todos`, {
      title: newTodoTitle.value,
      completed: false
    }, getAuthHeader()) // <--- 記得帶 Header

    newTodoTitle.value = ''
    await fetchTodos()
  } catch (error) {
    console.error(error)
  }
}

const updateTodo = async (todo) => {
  try {
    await axios.put(`${API_BASE}/todos/${todo.id}`, todo, getAuthHeader()) // <--- 記得帶 Header
  } catch (error) {
    console.error(error)
    todo.completed = !todo.completed
  }
}

const deleteTodo = async (id) => {
  if (!confirm('確定刪除？')) return
  try {
    await axios.delete(`${API_BASE}/todos/${id}`, getAuthHeader()) // <--- 記得帶 Header
    todos.value = todos.value.filter(t => t.id !== id)
  } catch (error) {
    console.error(error)
  }
}

// 一進畫面如果有 Token 就嘗試抓資料
onMounted(() => {
  if (token.value) {
    fetchTodos()
  }
})
</script>

<template>
  <div class="container">
    <h1>📝 你的私密 Todo List</h1>

    <div v-if="!token" class="login-box">
      <h2>請先登入</h2>
      <input v-model="username" placeholder="帳號" type="text" />
      <input v-model="password" placeholder="密碼" type="password" />
      <div class="btn-group">
        <button @click="handleLogin">登入</button>
        <button @click="handleRegister" class="secondary">註冊</button>
      </div>
    </div>

    <div v-else>
      <div class="user-info">
        <span>嗨，{{ currentUser }} 👋</span>
        <button @click="handleLogout" class="logout-btn">登出</button>
      </div>

      <div class="input-group">
        <input v-model="newTodoTitle" @keyup.enter="addTodo" placeholder="輸入待辦事項..." type="text" autofocus />
        <button @click="addTodo">新增</button>
      </div>

      <ul class="todo-list">
        <li v-for="todo in todos" :key="todo.id" :class="{ completed: todo.completed }">
          <label>
            <input type="checkbox" v-model="todo.completed" @change="updateTodo(todo)">
            <span>{{ todo.title }}</span>
          </label>
          <button class="delete-btn" @click="deleteTodo(todo.id)">刪除</button>
        </li>
      </ul>

      <p v-if="todos.length === 0" class="empty-hint">
        這裡空空的，快點新增一些任務吧！
      </p>
    </div>
  </div>
</template>

<style scoped>
/* 沿用原本的 CSS，並增加一些登入框的樣式 */
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
  color: #2c3e50;
}

h1 {
  text-align: center;
  margin-bottom: 2rem;
}

/* 登入區塊樣式 */
.login-box {
  display: flex;
  flex-direction: column;
  gap: 15px;
  max-width: 300px;
  margin: 0 auto;
}

.login-box input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

.btn-group {
  display: flex;
  gap: 10px;
}

.btn-group button {
  flex: 1;
}

.secondary {
  background-color: #95a5a6;
}

.secondary:hover {
  background-color: #7f8c8d;
}

/* 使用者資訊列 */
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.logout-btn {
  background-color: #747d8c;
  padding: 5px 12px;
  font-size: 14px;
}

/* 以下沿用舊樣式 */
.input-group {
  display: flex;
  gap: 10px;
  margin-bottom: 2rem;
}

input[type="text"] {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
}

input[type="text"]:focus {
  border-color: #42b883;
}

button {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

button:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 12px;
  border-radius: 8px;
  background: #f8f9fa;
  border: 1px solid #eee;
}

.todo-list label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  font-size: 18px;
}

input[type="checkbox"] {
  width: 20px;
  height: 20px;
  accent-color: #42b883;
}

.completed span {
  text-decoration: line-through;
  color: #bbb;
}

.delete-btn {
  background-color: #ff7675;
  padding: 8px 16px;
  font-size: 14px;
}

.delete-btn:hover {
  background-color: #d63031;
}

.empty-hint {
  text-align: center;
  color: #a4b0be;
  margin-top: 3rem;
}
</style>