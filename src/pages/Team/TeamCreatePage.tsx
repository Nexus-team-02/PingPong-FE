import { useState } from 'react'
import useApi from '@/hook/useApi'
import { createTeam } from '@/api/team'
import { CreateTeamForm } from '@/types/team'
import { useNavigate } from 'react-router-dom'
import { Role } from '@/types/user'
import { ROLE_CONFIG } from '@/constants/role'
import TeamTitle from '@/components/Team/TeamTitle'
import CreatorSection from '@/components/Team/CreatorSection'
import LinkSection from '@/components/Team/LinkSection'
import Button from '@/components/common/Button'
import { toast } from 'sonner'

export default function TeamCreatePage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<CreateTeamForm>({
    name: '',
    figma: '',
    discord: '',
    swagger: '',
    github: '',
    creatorRole: 'PM',
  })

  const { execute, loading } = useApi(createTeam)

  const handleChange = (key: keyof CreateTeamForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
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
      <TeamTitle value={form.name} onChange={(value) => handleChange('name', value)} />

      <div className='mt-12 space-y-16'>
        <CreatorSection
          value={form.creatorRole}
          onChange={(value: Role) => handleChange('creatorRole', value)}
        />
        <LinkSection
          figma={form.figma}
          discord={form.discord}
          swagger={form.swagger}
          github={form.github}
          onChange={handleChange}
        />
      </div>

      <div className='mt-20 flex justify-center gap-4'>
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
