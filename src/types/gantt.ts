export type DateRange = {
  start: string
  end: string
}

export type ApiPage = {
  id: string
  url: string
  title: string
  date?: DateRange
  status: string
  isNew?: boolean
}

export type Page = ApiPage & {
  originalDate?: DateRange
  originalTitle?: string
  originalStatus?: string
}
