import { useState } from 'react'
import useApi from '@/shared/hooks/useApi'
import { createTeam } from '@/features/team/api'
import { CreateTeamForm } from '@/features/team/types'
import { useNavigate } from 'react-router-dom'
import { Role } from '@/shared/types/user'
import { ROLE_CONFIG } from '@/shared/constants/role'
import TeamTitle from '@/features/team/components/TeamTitle'
import CreatorSection from '@/features/team/components/CreatorSection'
import LinkSection from '@/features/team/components/LinkSection'
import Button from '@/shared/components/Button'
import { toast } from 'react-toastify'

export default function TeamCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateTeamForm>({
    name: '',
    figma: '',
    discord: '',
    swagger: '',
    github: '',
    githubBranch: 'main',
    creatorRole: 'PM',
  })

  const { execute, loading } = useApi(createTeam)

  const handleChange = (key: keyof CreateTeamForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      toast.error('팀 이름을 입력해주세요.')
      return
    }
    try {
      await execute({
        ...form,
        creatorRole: ROLE_CONFIG[form.creatorRole].api,
      })
      toast.success('Team created successfully.')
      navigate('/mypage')
    } catch {
      // handleApiError에서 이미 toast.error() 처리됨
    }
  }

  const handleCancel = () => {
    navigate(-1)
  }

  return (
    <main className='mx-auto max-w-250 px-6 py-30'>
      <div className='animate-fade-up'>
        <TeamTitle value={form.name} onChange={(value) => handleChange('name', value)} />
      </div>

      <div className='mt-12 space-y-16'>
        <div className='animate-fade-up anim-delay-[0.1s]'>
          <CreatorSection
            value={form.creatorRole}
            onChange={(value: Role) => handleChange('creatorRole', value)}
          />
        </div>
        <div className='animate-fade-up anim-delay-[0.2s]'>
          <LinkSection
            figma={form.figma}
            discord={form.discord}
            swagger={form.swagger}
            github={form.github}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className='mt-20 flex justify-center gap-4 animate-fade-up anim-delay-[0.3s]'>
        <Button variant='outline' onClick={handleCancel} disabled={loading}>
          CANCEL
        </Button>
        <Button variant='primary' onClick={handleSubmit} disabled={loading}>
          {loading ? 'CREATING...' : 'CREATE'}
        </Button>
      </div>
    </main>
  )
}
