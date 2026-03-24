import Title from '@/shared/components/Title'
import RoleIcon from '@/assets/profile.svg?react'
import ArrowIcon from '@/assets/down.svg?react'
import { ROLE_CONFIG } from '@/shared/constants/role'
import { Role } from '@/shared/types/user'

interface CreatorSectionProps {
  value: Role
  onChange: (value: Role) => void
}

export default function CreatorSection({ value, onChange }: CreatorSectionProps) {
  return (
    <section className='rounded-xl border border-black/10 bg-white/60 px-6 py-8'>
      <Title size='md'>TEAM CREATOR</Title>

      <div className='mt-4 flex flex-col gap-4'>
        <div className='relative rounded-xl border border-black/10 bg-white/70 p-4'>
          <div className='mb-2 flex items-center gap-3'>
            <RoleIcon className='h-6 w-6' />
            <span className='text-sm font-semibold'>Role</span>
          </div>

          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value as Role)}
            className='w-full appearance-none cursor-pointer rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/30 focus:ring-1 focus:ring-black/20'
          >
            <option value='' disabled>
              Select role
            </option>

            {Object.entries(ROLE_CONFIG).map(([role, config]) => (
              <option key={role} value={role}>
                {config.label}
              </option>
            ))}
          </select>

          <ArrowIcon className='pointer-events-none absolute right-6 top-[68%] h-4 w-4 -translate-y-1/2' />
        </div>
      </div>
    </section>
  )
}
