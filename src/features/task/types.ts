export interface TaskFlowResponse {
  id: number
  title: string
  description: string
}

export interface TaskResponse {
  id: string
  url: string
  title: string
  dateStart: string
  dateEnd: string
  status: string
  lastSyncedAt: string
  flowMappingCompleted: boolean
  flows: TaskFlowResponse[]
}
