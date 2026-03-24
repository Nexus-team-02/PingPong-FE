import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'

export async function getGithubBranchs(url: string) {
  try {
    const res = await client.get(`/api/v1/teams/github/branches`, {
      params: { url },
    })
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getGithubConfig(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/github/config`)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function updateGithubConfig(teamId: number, payload: { url: string; branch: string }) {
  try {
    const res = await client.put(`/api/v1/teams/${teamId}/github/config`, payload)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getGithubSyncResult(teamId: number) {
  try {
    const res = await client.get(`/api/v1/teams/${teamId}/github/sync-result`)
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
