import { create } from 'zustand'

interface ApiAuthStore {
  token: string | null
  setToken: (token: string | null) => void
}

export const useApiAuthStore = create<ApiAuthStore>((set) => ({
  token: null,
  setToken: (token) => set({ token }),
}))
