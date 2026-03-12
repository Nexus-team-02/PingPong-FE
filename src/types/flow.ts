import { HttpMethod } from './api'

export interface CreateFlowRequest {
  title: string
  description: string
  imageTypes: string[]
}

export interface CompleteS3Request {
  imageId: number
  expectedObjectKey: string
}

export interface FlowImage {
  imageId: number
  imageUrl: string
}

export interface FlowDetailResponse {
  flowId: number
  title: string
  description: string
  images: FlowImage[]
}

export interface CommentData {
  id: number
  x: number
  y: number
  text: string
  content?: string
  imageId: number
  endpoints?: LinkedEndpoint[]
}

export interface FlowPageState {
  title?: string
  subtitle?: string
}

export function isFlowPageState(value: unknown): value is FlowPageState {
  if (!value || typeof value !== 'object') return false
  const v = value as Record<string, unknown>
  return (
    (v.title === undefined || typeof v.title === 'string') &&
    (v.subtitle === undefined || typeof v.subtitle === 'string')
  )
}

export interface CreateCommentRequest {
  x: number
  y: number
  content: string
}

export interface LinkedEndpoint {
  endpointId: number
  tag: string
  path: string
  method: HttpMethod
  summary: string
  isChanged: boolean
  isLinked: boolean
}

export interface RequestComment {
  requestId: number
  content: string
  x: number
  y: number
  endpoints: LinkedEndpoint[]
}
