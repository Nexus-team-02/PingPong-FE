import { client } from '@/shared/api/client'
import { SignupRequest, LoginRequest } from '@/shared/types/auth'
import { handleApiError } from '@/shared/api/handleApiError'

export async function signup(body: SignupRequest) {
  try {
    const res = await client.post('/api/v1/members', body)

    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function login(body: LoginRequest) {
  try {
    const res = await client.post('/api/v1/auth/login', body)

    const accessHeader = res.headers['authorization']
    const refreshToken = res.headers['refresh-token']

    if (!accessHeader || !refreshToken) {
      throw new Error('Tokens not found in response headers')
    }

    const accessToken = accessHeader.replace('Bearer ', '')

    const user = res.data.result

    return {
      accessToken,
      refreshToken,
      user,
    }
  } catch (error) {
    throw handleApiError(error)
  }
}
