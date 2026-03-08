import React, { useState } from 'react'
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

export interface TeamLayoutContext {
  setDynamicTitle: (title: string | null) => void
  setDynamicSubtitle: (subtitle: string | null) => void
}

export default function TeamLayout() {
  const { pathname } = useLocation()

  const [dynamicTitle, setDynamicTitle] = useState<string | null>(null)
  const [dynamicSubtitle, setDynamicSubtitle] = useState<string | null>(null)

  const segments = pathname.split('/')
  const role = segments[3]

  const bgClass = ROLE_BG[role] ?? 'bg-back'
  const puzzle = ROLE_PUZZLE[role]

  const defaultTitle = 'Express Service with PingPong'
  const defaultSubtitle = `Start "PINGPONG" as a ${role ?? ''} developer`

  const displayTitle = dynamicTitle ?? defaultTitle
  const displaySubtitle = dynamicSubtitle ?? defaultSubtitle

  return (
    <main className='relative min-h-screen overflow-hidden'>
      <div className='pointer-events-none fixed inset-0 -z-10'>
        <div className={`absolute inset-0 ${bgClass}`} />
        <div className='absolute -top-45 -right-20'>{puzzle}</div>
      </div>

      <div className='relative z-10'>
        <h1 className='absolute top-30 left-20 text-2xl font-extrabold'>{displayTitle}</h1>
        <h1 className='absolute top-42 left-20 text-sm text-gray-500'>{displaySubtitle}</h1>
        <Outlet context={{ setDynamicTitle, setDynamicSubtitle } satisfies TeamLayoutContext} />
      </div>
    </main>
  )
}
