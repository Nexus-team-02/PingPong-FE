import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Team } from '@/types/team'
import FALLBACK_IMG from '@/assets/placeholder.svg'

interface Props {
  team: Team
}

export default function ProjectCard({ team }: Props) {
  const navigate = useNavigate()
  const { isUpdated, name, thumbnailUrl, teamId } = team
  const [imgError, setImgError] = useState(false)

  const handleClick = () => {
    navigate(`/team/${teamId}`, { state: team })
  }
  console.log(thumbnailUrl)
  return (
    <div
      onClick={handleClick}
      className='cursor-pointer border border-black/10 rounded-md overflow-hidden relative'
    >
      <span
        className={`absolute text-[10px] font-medium px-1.5 py-0.5 rounded-br-md text-black
          ${isUpdated ? 'bg-api-blue' : 'bg-api-green'}`}
      >
        {isUpdated ? 'UPDATE' : 'OPEN'}
      </span>

      {!thumbnailUrl || imgError ? (
        <div className='h-50 w-full bg-gray-300/50 flex items-center justify-center'>
          <img src={FALLBACK_IMG} alt='placeholder' className='w-12 h-12 opacity-50' />
        </div>
      ) : (
        <img
          src={thumbnailUrl}
          alt={name}
          onError={() => setImgError(true)}
          className='h-50 w-full object-cover'
        />
      )}

      <div className='px-3 py-2.25 text-sm font-medium bg-[#F2F7FA]'>{name}</div>
    </div>
  )
}
