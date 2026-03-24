import Avatar from '@/assets/profile.svg?react'
import { useAuthStore } from '@/features/auth/store'

export default function ProfileSection() {
  const email = useAuthStore((state) => state.user.email)
  const nickname = useAuthStore((state) => state.user.nickname)

  return (
    <section className='flex items-center gap-6 py-10 px-32 mb-6'>
      <Avatar className='w-20 h-20' />

      <div>
        <h1 className='text-2xl font-bold mb-2'>{nickname}</h1>
        <p className='text-gray-500 text-sm'>{email}</p>
      </div>
    </section>
  )
}
