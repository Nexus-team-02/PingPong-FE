export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface QaEndpoint {
  endpointId: number
  method: HttpMethod
  path: string
  successRate: number | null
}

export interface QaTag {
  tag: string
  endpoints: QaEndpoint[]
}

export interface QaCase {
  qaId: number
  endpointId: number
  isSuccess: boolean
  description: string
  pathVariables: Record<string, string>
  queryParams: Record<string, string>
  headers: Record<string, string>
  body: string
  scenarioName: string
  createdAt: string
}

// ─── QA Detail Types ──────────────────────────────────────────────────────────

export interface QaParameter {
  name: string
  in: string
  type: string
  required: boolean
  description: string
  exampleValue: string
}

export interface QaRequest {
  mediaType: string
  required: boolean
  schema: string // JSON string
}

export interface QaResponse {
  statusCode: string
  mediaType: string
  description: string
  schema: string // JSON string
}

export interface QaSecurity {
  type: string
  scheme: string
  headerName?: string
  bearerFormat?: string
}

export interface QaData {
  pathVariables: Record<string, string>
  queryParams: Record<string, string>
  headers: Record<string, string>
  body: string
  expectedStatusCode: number
}

/** 단일 실행 결과 (QaPage의 ExecuteResult와 통합) */
export interface QaExecuteResult {
  qaExecuteId: number
  httpStatus: number
  isSuccess: boolean
  responseHeaders: Record<string, string>
  responseBody: string
  executedAt: string
  durationMs: number
  expectedStatusCode: number
}

export interface QaCaseDetail {
  qaId: number
  endpointId: number
  tag: string
  path: string
  method: HttpMethod
  description: string
  isSuccess: boolean
  parameters: QaParameter[]
  requests: QaRequest[]
  responses: QaResponse[]
  security: QaSecurity[]
  qaData: QaData
  latestExecuteResult: QaExecuteResult | null
}

export interface QaBulkExecuteResult {
  totalCount: number
  successCount: number
  failCount: number
  results: QaExecuteResult[]
}
