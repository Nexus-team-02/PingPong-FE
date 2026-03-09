import { useNavigate, useLocation } from 'react-router-dom'
import { ROLE_CONFIG, getRoleFromApi } from '@/constants/role'
import Title from '../common/Title'

interface Props {
  role?: string
}

export default function APISection({ role }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = () => {
    if (!role) return

    const internalRole = getRoleFromApi(role)
    if (!internalRole) return

    const subPath = ROLE_CONFIG[internalRole].route
    navigate(`${location.pathname}/${subPath}`)
  }

  return (
    <section className='flex flex-col gap-4'>
      <Title size='lg'>API</Title>

      <div
        onClick={handleClick}
        className='relative flex flex-col p-5 border border-gray-200 rounded-xl bg-white hover:border-blue-500 hover:shadow-md cursor-pointer transition-all group'
      >
        <div className='absolute top-5 right-5 flex items-center gap-1.5'>
          <span className='relative flex h-2.5 w-2.5'>
            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
            <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500'></span>
          </span>
          <span className='text-xs font-bold text-green-600'>Active</span>
        </div>

        <div className='flex items-center gap-3 mb-2'>
          <div className='p-2.5 bg-blue-50 text-blue-600 rounded-lg'>
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
          </div>
          <h3 className='text-base font-bold text-gray-800 group-hover:text-blue-600 transition-colors'>
            API Server
          </h3>
        </div>

        {/* 설명 텍스트 */}
        <p className='text-sm text-gray-500 mt-1'>
          클릭하여 API 명세서를 확인하고 엔드포인트를 연동하세요.
        </p>
      </div>
    </section>
  )
}
