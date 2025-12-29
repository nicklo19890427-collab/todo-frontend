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
  category?: Category | null
  // ✨ 新增以下兩個欄位
  priority: 'HIGH' | 'MEDIUM' | 'LOW' // 優先級 (限制只能是這三個字串)
  dueDate?: string | null // 截止日期 (後端回傳通常是 YYYY-MM-DD 字串)
}

// 定義 "使用者" 的資料結構
export interface User {
  username: string
  token: string
}
