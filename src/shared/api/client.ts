import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/features/auth/store'
import { useLoadingStore } from '@/shared/stores/loadingStore'

interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
  _retry?: boolean
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 20000,
})

client.interceptors.request.use((config) => {
  useLoadingStore.getState().startLoading()
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

client.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfigWithRetry

    const skipReissueUrls = ['/api/v1/auth/login', '/api/v1/members', '/api/v1/auth/reissue']
    const requestUrl = originalRequest.url ?? ''
    const isSkipped = skipReissueUrls.some((url) => requestUrl.includes(url))

    const { refreshToken } = useAuthStore.getState()

    if (error.response?.status === 401 && !originalRequest._retry && !isSkipped && refreshToken) {
      originalRequest._retry = true

      try {
        const reissueRes = await axios.post(
          '/api/v1/auth/reissue',
          {},
          {
            baseURL: import.meta.env.VITE_API_BASE_URL,
            headers: {
              'Refresh-Token': refreshToken,
            },
          },
        )

        const newAccessToken = reissueRes.headers['access-token'] as string

        useAuthStore.getState().setAuth({
          accessToken: newAccessToken,
          refreshToken,
          user: useAuthStore.getState().user!,
        })

        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        }
        return client(originalRequest)
      } catch (err) {
        useAuthStore.getState().logout()
        return Promise.reject(err)
      }
    }
    useLoadingStore.getState().stopLoading()
    return Promise.reject(error)
  },
)

export { client }
