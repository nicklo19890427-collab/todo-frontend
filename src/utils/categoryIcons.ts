import {
  faFolder,
  faBriefcase,
  faHouse,
  faBook,
  faGamepad,
  faPlane,
  faMusic,
  faCode,
  faCartShopping,
  faHeart,
} from '@fortawesome/free-solid-svg-icons'

// 定義可用的 Icon 選項
export const AVAILABLE_ICONS = [
  { name: 'folder', icon: faFolder, label: '預設' },
  { name: 'work', icon: faBriefcase, label: '工作' },
  { name: 'home', icon: faHouse, label: '生活' },
  { name: 'study', icon: faBook, label: '學習' },
  { name: 'game', icon: faGamepad, label: '娛樂' },
  { name: 'travel', icon: faPlane, label: '旅遊' },
  { name: 'music', icon: faMusic, label: '音樂' },
  { name: 'code', icon: faCode, label: '開發' },
  { name: 'shop', icon: faCartShopping, label: '購物' },
  { name: 'heart', icon: faHeart, label: '健康' },
]

// 輔助函式：根據名稱取得 Icon 物件
export const getIconByName = (name: string | undefined) => {
  const found = AVAILABLE_ICONS.find((i) => i.name === name)
  return found ? found.icon : faFolder
}
