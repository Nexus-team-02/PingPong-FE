import { Member } from '@/shared/types/user'
import Avatar from '@/assets/profile.svg?react'
import { ROLE_CONFIG, getRoleFromApi } from '@/shared/constants/role'

interface Props {
  member: Member
}

export default function MemberCard({ member }: Props) {
  const { name, email, role } = member

  const uiRole = getRoleFromApi(role)

  const config = uiRole ? ROLE_CONFIG[uiRole] : undefined

  return (
    <div
      className={`flex items-center gap-4
        border border-black/10 rounded-lg px-5 py-4
        ${config?.card ?? 'bg-white/70'}`}
    >
      <Avatar className='w-12 h-12 shrink-0' />

      <div className='flex-1 flex items-center justify-between'>
        <div>
          <div className='flex items-center gap-2 mb-0.5'>
            <p className='text-lg font-semibold leading-tight'>{name}</p>

            <span
              className={`inline-flex items-center justify-center
                text-[10px] leading-none font-light
                px-2 py-1 rounded-full
                ${config?.badge ?? ''}`}
            >
              {config?.label ?? role}
            </span>
          </div>

          <p className='text-xs font-light text-gray-500'>{email}</p>
        </div>
      </div>
    </div>
  )
}
