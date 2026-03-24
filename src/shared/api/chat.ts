import { client } from './client'
import { handleApiError } from './handleApiError'
import { useAuthStore } from '@/features/auth/store'

export async function initChatStream(teamId: number, message: string) {
  try {
    const res = await client.post(`/api/v1/teams/${teamId}/chat`, {
      message: message,
    })
    return res.data.result.streamId
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function connectChatStream(
  teamId: number,
  streamId: string,
  onMessage: (data: string) => void,
) {
  const token = useAuthStore.getState().accessToken

  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL}api/v1/teams/${teamId}/chat/stream?streamId=${streamId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!response.body) return

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (line.startsWith('data:')) {
        const data = line.slice(5)

        if (data === '[DONE]') {
          reader.cancel()
          return
        }

        onMessage(data)
      }
    }
  }
}
