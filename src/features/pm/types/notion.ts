export interface UpdatePageRequest {
  title?: string
  date?: {
    start: string
    end?: string
  }
  completedDate?: {
    start: string
    end?: string | null
  }
  status?: string
}

export interface CreatePageRequest {
  title: string
  date?: {
    start: string
    end?: string
  }
  completedDate?: {
    start: string
    end?: string | null
  }
  status?: string
}
