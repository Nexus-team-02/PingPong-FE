import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Team } from '@/features/team/types'
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

  return (
    <div
      onClick={handleClick}
      className='group relative flex flex-col cursor-pointer bg-white rounded-lg overflow-hidden'
      style={{
        border: '1.5px solid #e5e7eb',
        transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#111827' // 홈페이지 톤에 맞춰 다크한 색상 사용 (필요시 변경)
        el.style.boxShadow = '0 12px 30px rgba(0,0,0,0.06), 0 0 0 1px #111827'
        el.style.transform = 'translateY(-4px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#e5e7eb'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* 플로팅 뱃지 스타일로 변경 */}
      <div className='absolute -top-1 left-0 z-10'>
        <span
          className={`text-[10px] font-medium px-2.5 py-1 rounded-br-md text-white tracking-widest shadow-sm
            ${isUpdated ? 'bg-blue-600' : 'bg-emerald-600'}`}
        >
          {isUpdated ? 'UPDATE' : 'OPEN'}
        </span>
      </div>

      {/* 썸네일 영역 & 이미지 스케일 호버 효과 */}
      <div className='relative h-44 w-full bg-gray-50 overflow-hidden'>
        {!thumbnailUrl || imgError ? (
          <div className='absolute inset-0 flex items-center justify-center bg-gray-100/50'>
            <img src={FALLBACK_IMG} alt='placeholder' className='w-12 h-12 opacity-30 grayscale' />
          </div>
        ) : (
          <img
            src={thumbnailUrl}
            alt={name}
            onError={() => setImgError(true)}
            className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
          />
        )}
      </div>

      {/* 하단 텍스트 영역 */}
      <div className='px-4 py-3 border-t border-gray-100 flex items-center justify-between bg-white'>
        <span
          className='text-[16px] font-bold text-gray-900 truncate pr-2'
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {name}
        </span>
        {/* 호버 시 나타나는 화살표 아이콘 */}
        <svg
          className='w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-gray-900 transition-all transform group-hover:translate-x-1'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2.5} d='M9 5l7 7-7 7' />
        </svg>
      </div>
    </div>
  )
}
