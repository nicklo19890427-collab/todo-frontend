// 定義 "待辦事項" 的資料結構
export interface Todo {
  id: number
  title: string
  completed: boolean
}

// 定義 "使用者" 的資料結構 (對應後端回傳的登入資料)
export interface User {
  username: string
  token: string
}

// (未來如果有新的型別，例如 API 回傳格式，就可以繼續往下加，或是拆成別的檔案再從這裡 export)
