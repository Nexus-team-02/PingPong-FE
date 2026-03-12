import { useState, useEffect } from 'react'
import Modal from '@/components/common/Modal'
import Button from '@/components/common/Button'
import useApi from '@/hook/useApi'
import { searchMembers, inviteMember } from '@/api/team'
import { Member, SearchUser, Role } from '@/types/user'
import { ROLE_CONFIG } from '@/constants/role'

interface Props {
  teamId: number
  onClose: () => void
  onInvite?: (users: Member[]) => void
}

export default function InviteModal({ teamId, onClose, onInvite }: Props) {
  const { execute: searchExecute, data: searchData, loading: searchLoading } = useApi(searchMembers)

  const { execute: inviteExecute, loading: inviteLoading } = useApi(inviteMember)

  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Member[]>([])

  useEffect(() => {
    if (query.trim()) {
      searchExecute(query)
    }
  }, [query, searchExecute])

  const filteredUsers: SearchUser[] =
    searchData?.result?.filter(
      (user: SearchUser) => !selected.some((s) => s.memberId === user.memberId),
    ) ?? []

  const addUser = (user: SearchUser) => {
    const mappedUser: Member = {
      memberId: user.memberId,
      name: user.nickname,
      email: user.email,
      role: 'FRONTEND',
    }

    setSelected((prev) => [...prev, mappedUser])
    setQuery('')
  }

  const handleInvite = async () => {
    try {
      const payload = selected.map((user) => ({
        teamId,
        memberId: user.memberId,
        role: ROLE_CONFIG[user.role].api,
      }))

      await inviteExecute(payload)
      onInvite?.(selected)
      onClose()
    } catch (err) {
      console.error('Failed to invite members.', err)
    }
  }

  return (
    <Modal
      title='INVITE'
      size='md'
      bg='bg-gradient-to-b from-api-blue/10 to-white'
      onClose={onClose}
    >
      <p className='mb-4 text-[12px] text-gray-500'>Start NEXUS with your team member</p>

      <div className='relative mb-4'>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Search by name or email'
          className='w-full rounded-md border border-black/20 px-3 py-2 text-sm focus:border-api-blue focus:shadow-blue focus:outline-none'
        />

        {query && filteredUsers.length > 0 && !searchLoading && (
          <ul className='absolute z-10 mt-1 w-full rounded-md border border-black/20 bg-white shadow'>
            {filteredUsers.map((user) => (
              <li
                key={user.memberId}
                onClick={() => addUser(user)}
                className='cursor-pointer px-3 py-2 text-sm hover:bg-gray-100'
              >
                <p className='mb-1 font-medium'>{user.nickname}</p>
                <p className='text-xs font-light text-gray-400'>{user.email}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className='mb-4 space-y-2'>
        {selected.map((user) => (
          <div
            key={user.memberId}
            className='flex items-center justify-between rounded-md border border-black/20 bg-white/50 px-3 py-2'
          >
            <div>
              <p className='mb-0.5 text-sm font-medium'>{user.name}</p>
              <p className='text-xs font-light text-gray-400'>{user.email}</p>
            </div>

            <select
              value={user.role}
              onChange={(e) =>
                setSelected((prev) =>
                  prev.map((u) =>
                    u.memberId === user.memberId ? { ...u, role: e.target.value as Role } : u,
                  ),
                )
              }
              className='rounded border border-black/20 px-2 py-1 text-sm'
            >
              {Object.entries(ROLE_CONFIG).map(([role, config]) => (
                <option key={role} value={role}>
                  {config.label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <Button
        className='w-full'
        disabled={selected.length === 0 || inviteLoading}
        onClick={handleInvite}
      >
        {inviteLoading ? 'INVITING...' : 'INVITE'}
      </Button>
    </Modal>
  )
}
