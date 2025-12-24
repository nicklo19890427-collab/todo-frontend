// ✨ 新增：定義 "分類" 的資料結構
export interface Category {
  id: number
  name: string
}

// 定義 "待辦事項" 的資料結構
export interface Todo {
  id: number
  title: string
  completed: boolean
  category?: Category | null // ✨ 新增：這筆待辦屬於哪個分類 (可能是 null)
}

// 定義 "使用者" 的資料結構
export interface User {
  username: string
  token: string
}
