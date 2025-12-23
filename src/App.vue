<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// 設定後端 API 網址 (這是我們剛剛用 Java 寫好的入口)
const API_URL = const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/todos'

const todos = ref([])
const newTodoTitle = ref('')

// --- 動作 1: 讀取資料 (Read) ---
const fetchTodos = async () => {
  try {
    const response = await axios.get(API_URL)
    todos.value = response.data
    console.log('成功拿到資料:', response.data)
  } catch (error) {
    console.error('無法連線到後端:', error)
    alert('連線失敗！請確認 Java 後端 Server 有沒有跑起來？')
  }
}

// --- 動作 2: 新增資料 (Create) ---
const addTodo = async () => {
  // 如果輸入框是空的，就不理他
  if (!newTodoTitle.value.trim()) return

  try {
    const todoData = {
      title: newTodoTitle.value,
      completed: false
    }
    // 發送 POST 請求給後端
    await axios.post(API_URL, todoData)

    // 清空輸入框並重新抓取最新列表
    newTodoTitle.value = ''
    await fetchTodos()
  } catch (error) {
    console.error('新增失敗:', error)
  }
}

// --- 動作 3: 更新狀態 (Update) ---
const updateTodo = async (todo) => {
  try {
    // 發送 PUT 請求，把整包物件(包含新的 completed 狀態)傳回去
    await axios.put(`${API_URL}/${todo.id}`, todo)
    console.log('狀態更新成功')
  } catch (error) {
    console.error('更新失敗:', error)
    // 如果失敗，把畫面上的勾選狀態改回來，避免誤導使用者
    todo.completed = !todo.completed
  }
}

// --- 動作 4: 刪除資料 (Delete) ---
const deleteTodo = async (id) => {
  if (!confirm('確定要刪除這個待辦事項嗎？')) return

  try {
    await axios.delete(`${API_URL}/${id}`)
    // 成功後，直接從前端陣列把這一筆拿掉 (這樣不用重新整理頁面)
    todos.value = todos.value.filter(t => t.id !== id)
  } catch (error) {
    console.error('刪除失敗:', error)
  }
}

// 當畫面掛載完成時，立刻執行抓取資料
onMounted(() => {
  fetchTodos()
})
</script>

<template>
  <div class="container">
    <h1>📝 我的全端 Todo List</h1>

    <div class="input-group">
      <input v-model="newTodoTitle" @keyup.enter="addTodo" placeholder="輸入待辦事項，按 Enter 新增..." type="text" autofocus />
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
      目前沒有待辦事項，資料庫空空的 🍃
    </p>
  </div>
</template>

<style scoped>
/* 讓介面看起來乾淨清爽的 CSS */
.container {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 2rem;
}

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
  transition: border-color 0.3s;
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
  font-size: 16px;
  transition: all 0.3s;
}

button:hover {
  background-color: #3aa876;
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
  transition: all 0.2s;
}

.todo-list li:hover {
  transform: translateX(5px);
  border-color: #42b883;
}

.todo-list label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  flex: 1;
  font-size: 18px;
}

/* 讓 Checkbox 大一點 */
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
  font-size: 1.2rem;
}
</style>