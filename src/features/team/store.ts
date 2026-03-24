import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface TeamRoleState {
  role: string | null
  teamId: number | null
  setRole: (role: string) => void
  setTeamId: (teamId: number) => void
  clear: () => void
}

export const useTeamRoleStore = create<TeamRoleState>()(
  persist(
    (set) => ({
      role: null,
      teamId: null,
      setRole: (role) => set({ role }),
      setTeamId: (teamId) => set({ teamId }),
      clear: () => set({ role: null, teamId: null }),
    }),
    {
      name: 'team-role-storage',
    },
  ),
)
