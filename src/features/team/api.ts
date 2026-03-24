import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'
import { CreateTeamRequest, InviteTeamRequest } from '@/features/team/types'

export async function getTeams() {
  try {
    const res = await client.get('/api/teams/my')
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function createTeam(body: CreateTeamRequest) {
  try {
    const res = await client.post('/api/teams', body)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getTeamMembers(teamId: number) {
  try {
    const res = await client.get(`/api/teams/${teamId}/members`)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function searchMembers(keyword: string) {
  try {
    const res = await client.get(`/api/v1/members/search`, {
      params: { keyword },
    })

    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function inviteMember(body: InviteTeamRequest[]) {
  console.log(body)
  try {
    const res = await client.post(`/api/teams/members`, body)
    return res.data
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function getTeamRole(teamId: number) {
  try {
    const res = await client.get(`/api/teams/${teamId}/my-role`)
    return res.data.result.role
  } catch (error) {
    throw handleApiError(error)
  }
}
