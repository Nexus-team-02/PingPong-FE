import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'
import { CreatePageRequest, UpdatePageRequest } from '@/features/pm/types/notion'

export async function exchangeNotionToken(teamId: number, code: string) {
  try {
    const res = await client.post(`/api/v1/teams/${teamId}/notion/token`, {
      code,
    })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getNotionStatus(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/notion/status`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getDatabase(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/notion/databases`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function selectDatabase(teamId: number, databaseId: string) {
  try {
    const res = await client.put(`/api/v1/teams/${teamId}/notion/databases/primary`, {
      databaseId,
    })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getPrimaryDatabase(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/notion/databases/primary`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function createPrimaryPage(teamId: number, body: CreatePageRequest) {
  try {
    const res = await client.post(`/api/v1/teams/${teamId}/notion/databases/primary`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getPageDetail(teamId: number, pageId: string) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/notion/pages/${pageId}`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function updatePage(teamId: number, pageId: string, body: UpdatePageRequest) {
  try {
    const res = await client.patch(`/api/v1/teams/${teamId}/notion/pages/${pageId}`, body)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
