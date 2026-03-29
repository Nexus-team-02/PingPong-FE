import { useNavigate, useLocation } from 'react-router-dom'
import { ROLE_CONFIG } from '@/shared/constants/role'
import { useTeamRoleStore } from '@/features/team/store'
import Title from '@/shared/components/Title'

const TEAM_SECTIONS = [
  {
    id: 'PM',
    title: 'PM (기획)',
    description: '기획서, 일정 및 프로젝트 관리 문서를 확인하세요.',
    theme: {
      bg: 'bg-pink-50',
      text: 'text-pink-600',
      hoverBorder: 'hover:border-pink-500',
      hoverText: 'group-hover:text-pink-600',
      indicatorBg: 'bg-pink-500',
      indicatorPing: 'bg-pink-400',
    },
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'></path>
        <polyline points='14 2 14 8 20 8'></polyline>
        <line x1='16' y1='13' x2='8' y2='13'></line>
        <line x1='16' y1='17' x2='8' y2='17'></line>
        <polyline points='10 9 9 9 8 9'></polyline>
      </svg>
    ),
  },
  {
    id: 'FRONTEND',
    title: 'Frontend',
    description: '화면 Flow를 설계하고 Swagger로 API 연동 상태를 확인하세요.',
    theme: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      hoverBorder: 'hover:border-blue-500',
      hoverText: 'group-hover:text-blue-600',
      indicatorBg: 'bg-blue-500',
      indicatorPing: 'bg-blue-400',
    },
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect x='2' y='3' width='20' height='14' rx='2' ry='2'></rect>
        <line x1='8' y1='21' x2='16' y2='21'></line>
        <line x1='12' y1='17' x2='12' y2='21'></line>
      </svg>
    ),
  },
  {
    id: 'BACKEND',
    title: 'Backend',
    description: 'Swagger·GitHub 변경 내역을 추적하고, API 연동 화면을 조율하세요.',
    theme: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-600',
      hoverBorder: 'hover:border-yellow-500',
      hoverText: 'group-hover:text-yellow-600',
      indicatorBg: 'bg-yellow-500',
      indicatorPing: 'bg-yellow-400',
    },
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <rect width='20' height='8' x='2' y='2' rx='2' ry='2' />
        <rect width='20' height='8' x='2' y='14' rx='2' ry='2' />
        <line x1='6' x2='6.01' y1='6' y2='6' />
        <line x1='6' x2='6.01' y1='18' y2='18' />
      </svg>
    ),
  },
  {
    id: 'QA',
    title: 'QA (품질 보증)',
    description: 'AI가 자동 생성한 테스트 케이스를 실행하고 API 동작을 검증하세요.',
    theme: {
      bg: 'bg-green-50',
      text: 'text-green-600',
      hoverBorder: 'hover:border-green-500',
      hoverText: 'group-hover:text-green-600',
      indicatorBg: 'bg-green-500',
      indicatorPing: 'bg-green-400',
    },
    icon: (
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M22 11.08V12a10 10 0 1 1-5.93-9.14'></path>
        <polyline points='22 4 12 14.01 9 11.01'></polyline>
      </svg>
    ),
  },
]

export default function TeamSection() {
  const navigate = useNavigate()
  const location = useLocation()
  const userRole = useTeamRoleStore((s) => s.role)

  const handleClick = (sectionId) => {
    if (!userRole) return

    const subPath = ROLE_CONFIG[sectionId]?.route || sectionId.toLowerCase()
    navigate(`${location.pathname}/${subPath}`)
  }

  return (
    <section className='flex flex-col bg-gray-100/30 p-5 rounded-xl border border-black/5'>
      <Title size='lg'>TEAM DOCS</Title>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2'>
        {TEAM_SECTIONS.map((section) => (
          <div
            key={section.id}
            onClick={() => handleClick(section.id)}
            className={`relative flex flex-col p-5 border border-gray-200 rounded-xl bg-white transition-all group
              ${
                userRole
                  ? `hover:shadow-md cursor-pointer ${section.theme.hoverBorder}`
                  : 'opacity-50 cursor-not-allowed'
              }`}
          >
            <div className='absolute top-5 right-5 flex items-center gap-1.5'>
              <span className='relative flex h-2.5 w-2.5'>
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${section.theme.indicatorPing}`}
                ></span>
                <span
                  className={`relative inline-flex rounded-full h-2.5 w-2.5 ${section.theme.indicatorBg}`}
                ></span>
              </span>
              <span className={`text-xs font-bold ${section.theme.text}`}>Active</span>
            </div>

            <div className='flex items-center gap-3 mb-2'>
              <div className={`p-2.5 rounded-lg ${section.theme.bg} ${section.theme.text}`}>
                {section.icon}
              </div>
              <h3
                className={`text-base font-bold text-gray-800 transition-colors ${section.theme.hoverText}`}
              >
                {section.title}
              </h3>
            </div>

            <p className='text-sm text-gray-500 mt-1'>{section.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
