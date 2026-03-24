import { useEffect } from 'react'
import MemberSection from '@/features/team/components/MemberSection'
import APISection from '@/features/team/components/APISection'

import NotionIcon from '@/assets/notion.svg?react'
import SwaggerIcon from '@/assets/swagger.svg?react'
import FigmaIcon from '@/assets/figma.svg?react'
import DiscordIcon from '@/assets/discord.svg?react'
import GithubIcon from '@/assets/github.svg?react'

import useApi from '@/shared/hooks/useApi'
import { useTeamRoleStore } from '@/features/team/store'
import { getTeamMembers, getTeamRole } from '@/features/team/api'
import { useLocation } from 'react-router-dom'
import { Team } from '@/features/team/types'
import Spinner from '@/shared/components/Spinner'
import ErrorMessage from '@/shared/components/ErrorMessage'

const TEAM_LINK_ICONS = {
  notion: NotionIcon,
  figma: FigmaIcon,
  github: GithubIcon,
  discord: DiscordIcon,
  swagger: SwaggerIcon,
} as const

type TeamLinkKey = keyof typeof TEAM_LINK_ICONS

export default function TeamDetailPage() {
  const location = useLocation()
  const team = location.state as Team | undefined
  const { setRole } = useTeamRoleStore()

  const { execute: executeMembers, data: memberData, loading } = useApi(getTeamMembers)
  const { execute: executeRole, data: roleData } = useApi(getTeamRole)

  useEffect(() => {
    if (!team) return
    executeMembers(team.teamId)
    executeRole(team.teamId)
  }, [executeMembers, executeRole, team])

  useEffect(() => {
    if (roleData) {
      setRole(roleData)
    }
  }, [roleData, setRole])

  if (!team) return <ErrorMessage message='잘못된 접근입니다.' />
  if (loading) return <Spinner />

  return (
    <main className='mx-auto max-w-250 px-6 py-30'>
      <div>
        <h1 className='font-extrabold text-3xl'>{team.name}</h1>

        <div className='mt-4 flex items-center gap-2.5'>
          {(Object.keys(TEAM_LINK_ICONS) as TeamLinkKey[]).map((key) => {
            const url = team[key]
            if (!url) return null
            const Icon = TEAM_LINK_ICONS[key]
            return (
              <a key={key} href={url} target='_blank' rel='noopener noreferrer'>
                <Icon className='h-8 w-8' />
              </a>
            )
          })}
        </div>
      </div>

      <div className='mt-20 space-y-16'>
        <MemberSection teamId={team.teamId} members={memberData || []} />
        <APISection />
      </div>
    </main>
  )
}
