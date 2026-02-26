import Front from '@/assets/front_puzzle.svg?react'
import Back from '@/assets/back_puzzle.svg?react'
import PM from '@/assets/pm_puzzle.svg?react'
import QA from '@/assets/qa_puzzle.svg?react'
import { Outlet, useLocation } from 'react-router-dom'

const ROLE_PUZZLE: Record<string, React.ReactNode> = {
  backend: <Back />,
  frontend: <Front />,
  qa: <QA />,
  pm: <PM />,
}

const ROLE_BG: Record<string, string> = {
  backend: 'bg-back',
  frontend: 'bg-front',
  qa: 'bg-qa',
  pm: 'bg-pm',
}

export default function TeamLayout() {
  const { pathname } = useLocation()

  const segments = pathname.split('/')
  const role = segments[3]

  const bgClass = ROLE_BG[role] ?? 'bg-back'
  const puzzle = ROLE_PUZZLE[role]

  return (
    <main className='relative min-h-screen overflow-hidden'>
      <div className='pointer-events-none fixed inset-0 -z-10'>
        <div className={`absolute inset-0 ${bgClass}`} />
      </div>

      <div className='relative z-10'>
        <div className='absolute -top-45 -right-20'>{puzzle}</div>
        <h1 className='absolute top-30 left-20 text-2xl font-extrabold'>
          Express Service with PingPong
        </h1>
        <h1 className='absolute top-42 left-20 text-sm text-gray-500'>
          Start "PINGPONG" as a {role} developer
        </h1>
        <Outlet />
      </div>
    </main>
  )
}
