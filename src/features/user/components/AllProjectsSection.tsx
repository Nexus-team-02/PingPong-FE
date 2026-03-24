import { useState } from 'react'
import { Team } from '@/features/team/types'
import ProjectGrid from './ProjectGrid'
import Pagination from './Pagination'
import Title from '@/shared/components/Title'
import SearchInput from '@/shared/components/SearchInput'

interface Props {
  teams: Team[]
}

export default function AllProjectsSection({ teams }: Props) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 8

  const filtered = teams.filter((team) => team.name.toLowerCase().includes(query.toLowerCase()))

  const start = (page - 1) * PER_PAGE
  const items = filtered.slice(start, start + PER_PAGE)

  return (
    <section className='mx-32 mb-20'>
      <Title right={<SearchInput value={query} onChange={setQuery} />}>ALL</Title>

      <ProjectGrid teams={items} />

      <Pagination current={page} total={Math.ceil(filtered.length / PER_PAGE)} onChange={setPage} />
    </section>
  )
}
