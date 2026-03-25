import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'
import { useApiAuthStore } from '@/shared/stores/apiAuthStore'

export async function getTags(teamId: number) {
  try {
    const res = await client.get(`/api/v1/qa/tags`, {
      params: { teamId },
    })
    console.log('API 전체 조회:', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getQaCases(endpointId) {
  try {
    const res = await client.get(`/api/v1/qa`, {
      params: { endpointId },
    })
    console.log('QA CASE 조회:', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getQaCaseDetail(qaId: number) {
  try {
    const res = await client.get(`/api/v1/qa/${qaId}/results`)
    console.log(qaId, '번 QA CASE 상세 조회:', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getAllExecuteResult(qaId: number) {
  try {
    const res = await client.get(`/api/v1/qa/execute-result`, {
      params: { qaId },
    })
    console.log('이전 실행 결과 조회:', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function executeQaCase(qaId: number) {
  try {
    const token = useApiAuthStore.getState().token

    console.log(token)
    const res = await client.post(`/api/v1/qa/${qaId}/execute`, undefined, {
      headers: {
        ...(token && { 'X-Proxy-Authorization': `Bearer ${token}` }),
      },
    })

    console.log(qaId, '번 QA CASE 실행:', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export interface ReRunQaCaseRequest {
  pathVariables?: Record<string, string>
  queryParams?: Record<string, string>
  headers?: Record<string, string>
  body?: string
}

export async function reRunQaCase(qaId: number, data: ReRunQaCaseRequest) {
  try {
    const res = await client.post(`/api/v1/qa/${qaId}/re-run`, data)
    console.log('재실행 : ', res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function executeBulkQaCases(qaIds: number[]) {
  try {
    const res = await client.post(`/api/v1/qa/execute/bulk`, { qaIds })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
