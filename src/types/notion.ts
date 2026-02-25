export interface UpdatePageRequest {
  title?: string
  date?: {
    start: string
    end?: string
  }
  status?: string
}

export interface CreatePageRequest {
  title: string
  date?: {
    start: string
    end?: string
  }
  status?: string
}
