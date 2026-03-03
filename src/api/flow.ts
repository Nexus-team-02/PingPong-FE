import { client } from './client'
import { handleApiError } from './handleApiError'
import { CreateFlowRequest } from '@/types/flow'

export async function createFlow(body: CreateFlowRequest, teamId: number) {
  try {
    const res = await client.post(`/api/v1/flows/${teamId}`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
