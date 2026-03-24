export type DateRange = {
  start: string
  end: string
}

export type ApiPage = {
  id: string
  url: string
  title: string
  date?: DateRange
  completedDate?: DateRange
  status: string
  isNew?: boolean
}

export type Page = ApiPage & {
  originalDate?: DateRange
  originalCompletedDate?: DateRange
  originalTitle?: string
  originalStatus?: string
}
