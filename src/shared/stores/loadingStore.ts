import { create } from 'zustand'

interface LoadingState {
  loadingCount: number
  startLoading: () => void
  stopLoading: () => void
  isLoading: boolean
}

export const useLoadingStore = create<LoadingState>((set, get) => ({
  loadingCount: 0,
  startLoading: () => set((state) => ({ loadingCount: state.loadingCount + 1 })),
  stopLoading: () => set((state) => ({ loadingCount: Math.max(0, state.loadingCount - 1) })),
  get isLoading() {
    return get().loadingCount > 0
  },
}))
