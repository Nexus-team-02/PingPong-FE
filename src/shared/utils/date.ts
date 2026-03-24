export const DAY_WIDTH = 80
export const NUM_DAYS = 31
export const TODAY_DATE = new Date()

export const TASK_COL_WIDTH = 224

export const addDays = (date: Date, days: number) => {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

export const getToday = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

export const BASE_DATE = addDays(getToday(), -3)

export const formatDate = (date: Date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const formatHeaderDate = (date: Date) => {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export const getDayOffset = (dateStr: string) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const base = new Date(BASE_DATE.getFullYear(), BASE_DATE.getMonth(), BASE_DATE.getDate())

  const diff = date.getTime() - base.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24)) + 1
}
