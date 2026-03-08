import { client } from './client'
import { handleApiError } from './handleApiError'
import { ExecuteEndpointRequest } from '@/types/api'

export async function SyncSwagger(teamId: number) {
  try {
    const res = await client.post(`/api/v1/swagger/${teamId}/sync`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function executeEndpoint(
  endpointId: number,
  teamId: number,
  body: ExecuteEndpointRequest,
) {
  try {
    const res = await client.post(`/api/v1/endpoints/${endpointId}/execute`, body, {
      params: { teamId },
    })

    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getAllEndpoints(teamId: number) {
  try {
    const res = await client.get(`/api/v1/endpoints`, {
      params: { teamId },
    })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getDetailsEndpoint(endpointId: number) {
  try {
    const res = await client.get(`/api/v1/endpoints/${endpointId}`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
