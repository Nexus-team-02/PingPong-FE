import { useEffect } from 'react'
import useApi from '@/shared/hooks/useApi'
import { getTeams } from '@/features/team/api'
import { useNavigate } from 'react-router-dom'
import { PATH } from '@/app/router/path'
import { Team } from '@/features/team/types'

import AllProjectsSection from './AllProjectsSection'
import Plus from '@/assets/plus_white.svg?react'

export default function MyTeamSection() {
  const navigate = useNavigate()

  const { execute, data } = useApi<Team[]>(getTeams)

  useEffect(() => {
    execute()
  }, [execute])

  const teams = data ?? []

  return (
    <section>
      <div className='flex justify-between items-center mb-16 px-32'>
        <h2 className='text-2xl tracking-tight font-bold'>MY TEAM</h2>
        <button
          onClick={() => navigate(PATH.team.create)}
          className='cursor-pointer flex items-center justify-center pl-3 pr-4 py-2 rounded-full bg-black text-white text-sm'
        >
          <Plus className='w-5 h-5 mr-1.5' /> NEW
        </button>
      </div>

      <AllProjectsSection teams={teams} />
    </section>
  )
}
