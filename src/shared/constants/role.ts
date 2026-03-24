import { Role } from '@/shared/types/user'

export const ROLE_CONFIG: Record<
  Role,
  {
    label: string
    api: string
    route: string
    badge: string
    card: string
  }
> = {
  PM: {
    label: 'PM',
    api: 'PLANNING',
    route: 'pm',
    badge: 'bg-[#FFB8B9]/70 text-[#c46163]',
    card: 'bg-pink-50/60',
  },
  FRONTEND: {
    label: 'Frontend',
    api: 'FRONTEND',
    route: 'frontend',
    badge: 'bg-[#93C2FF]/70 text-[#5d83b4]',
    card: 'bg-blue-50/60',
  },
  BACKEND: {
    label: 'Backend',
    api: 'BACKEND',
    route: 'backend',
    badge: 'bg-[#FFE08B]/70 text-[#cfa83a]',
    card: 'bg-yellow-50/60',
  },
  QA: {
    label: 'QA',
    api: 'QA',
    route: 'qa',
    badge: 'bg-[#49CC90]/70 text-[#579176]',
    card: 'bg-green-50/60',
  },
}

export const getRoleFromApi = (apiRole: string): Role | undefined => {
  return (Object.keys(ROLE_CONFIG) as Role[]).find((role) => ROLE_CONFIG[role].api === apiRole)
}
