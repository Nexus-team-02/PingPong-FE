import { Team } from '@/features/team/types'
import ProjectCard from './ProjectCard'

interface Props {
  teams: Team[]
}

export default function ProjectGrid({ teams }: Props) {
  return (
    <div className='grid grid-cols-4 gap-6 mb-17 min-h-115 items-start'>
      {teams.map((project) => (
        <ProjectCard key={project.teamId} team={project} />
      ))}
    </div>
  )
}
