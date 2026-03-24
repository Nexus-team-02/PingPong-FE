import axios from 'axios'
import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'
import { CreateFlowRequest, CompleteS3Request, CreateCommentRequest } from '@/features/flow/types'

export async function createFlow(body: CreateFlowRequest, teamId: number) {
  try {
    const res = await client.post(`/api/v1/flows/${teamId}`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export const uploadImageToS3 = async (presignedUrl: string, file: File) => {
  const res = await axios.put(presignedUrl, file, {
    headers: {
      'Content-Type': file.type,
    },
  })

  console.log(res)
  return res
}

export async function completeS3(body: CompleteS3Request[]) {
  try {
    const res = await client.post(`/api/v1/flows/image-upload/complete`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getFlow(teamId: number, role: string) {
  try {
    const res = await client.get(`/api/v1/flows/teams/${teamId}`, { params: { role } })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getFlowDetails(flowId: string) {
  try {
    const res = await client.get(`/api/v1/flows/${flowId}`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getFlowImageDetails(flowImageId: string) {
  try {
    const res = await client.get(`/api/v1/flows/images/${flowImageId}/requests`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function createRequestComment(imageId: number, body: CreateCommentRequest) {
  try {
    const res = await client.post(`/api/v1/flows/images/${imageId}/requests`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getRequestComment(flowImageId: number) {
  try {
    const res = await client.get(`/api/v1/flows/images/${flowImageId}/requests`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function linkEndpointsToRequest(requestId: number, data: { endpointIds: number[] }) {
  try {
    const res = await client.post(`/api/v1/flows/images/requests/${requestId}/endpoints`, data)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
