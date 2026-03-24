import { Role } from '@/shared/types/user'

export interface Team {
  teamId: number
  name: string
  notion?: string
  figma?: string
  discord?: string
  swagger?: string
  github?: string
  thumbnailUrl?: string
  isUpdated: boolean
}

export interface CreateTeamRequest {
  name: string
  figma: string
  discord: string
  swagger: string
  github: string
  githubBranch: string
  creatorRole: string
}

export interface CreateTeamForm {
  name: string
  figma: string
  discord: string
  swagger: string
  github: string
  githubBranch: string
  creatorRole: Role
}

export interface InviteTeamRequest {
  teamId: number
  memberId: number
  role: string
}
