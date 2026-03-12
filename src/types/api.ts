export interface ExecuteEndpointRequest {
  pathVariables?: Record<string, string>
  queryParams?: Record<string, string>
  headers?: Record<string, string>
  body?: string
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface ApiParameter {
  name: string
  description?: string
  required?: boolean
  type: string
  in: string
}

export interface ApiRequest {
  mediaType: string
  required?: boolean
  schema?: Record<string, unknown> | unknown
}

export interface ApiResponse {
  statusCode: string | number
  description: string
  mediaType: string
  schema?: Record<string, unknown> | unknown
}

export interface ApiSecurityRequirement {
  type: string
  scheme: string
  headerName?: string
  bearerFormat?: string
}

export interface OpenApiSchema {
  type?: 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array'
  properties?: Record<string, OpenApiSchema>
  items?: OpenApiSchema
  example?: unknown
  minLength?: number
  required?: string[]
}

export interface ExecutionResult {
  status?: number
  data?: unknown
  error?: boolean
  message?: string
  details?: unknown
}
