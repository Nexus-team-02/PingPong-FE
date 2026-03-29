import { useState } from 'react'
import { Member } from '@/shared/types/user'
import Title from '@/shared/components/Title'
import Plus from '@/assets/plus.svg?react'
import MemberCard from './MemberCard'
import InviteModal from './InviteModal'

export default function MemberSection({ members, teamId }: { members: Member[]; teamId: number }) {
  const [isOpen, setOpen] = useState(false)
  return (
    <section className='bg-gray-100/30 p-5 rounded-xl border border-black/5'>
      <Title
        size='lg'
        right={<Plus onClick={() => setOpen(true)} className='w-7 h-7 cursor-pointer' />}
      >
        TEAM MEMBER
      </Title>

      <div className='mt-6 grid grid-cols-3 gap-4'>
        {members.map((member) => (
          <MemberCard key={member.memberId} member={member} />
        ))}
      </div>

      {isOpen && <InviteModal teamId={teamId} onClose={() => setOpen(false)} />}
    </section>
  )
}
