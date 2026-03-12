import axios from 'axios'
import { toast } from 'sonner'

export function handleApiError(error: unknown) {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      const res = error.response.data
      const message = res?.message ?? '알 수 없는 서버 오류가 발생했습니다.'
      toast.error(message)
      return {
        status: error.response.status,
        message,
        code: res?.code,
      }
    }

    if (error.request) {
      toast.error('서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.')
      return {
        status: null,
        message: '서버에 연결할 수 없습니다. 네트워크를 확인해 주세요.',
      }
    }
  }

  const message = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
  toast.error(message)
  return {
    status: null,
    message,
  }
}
