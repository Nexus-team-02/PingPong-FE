export type Role = 'FRONTEND' | 'BACKEND' | 'PM' | 'QA'

export interface User {
  userId: number
  nickname: string
  email?: string
  role?: Role
  pofile?: string
}

export interface Member {
  memberId: number
  name: string
  email: string
  role: Role
}

export interface SearchUser {
  memberId: number
  nickname: string
  email: string
}
