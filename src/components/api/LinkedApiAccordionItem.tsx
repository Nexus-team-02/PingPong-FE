import { useState } from 'react'
import ApiAccordionItem from './ApiAccordionItem'
import { completeEndpoint } from '@/api/swagger'
import useApi from '@/hook/useApi'
import { HttpMethod } from '@/types/api'
import { useTeamRoleStore } from '@/stores/teamRoleStore'

interface LinkedApiAccordionItemProps {
  method: HttpMethod
  path: string
  summary: string
  endpointId: number
  flowImageId: number
  isLinked: boolean
}

interface LinkedApiAccordionItemProps {
  method: HttpMethod
  path: string
  summary: string
  endpointId: number
  flowImageId: number
  isLinked: boolean
}

export default function LinkedApiAccordionItem({
  isLinked: initialIsLinked,
  flowImageId,
  ...accordionProps
}: LinkedApiAccordionItemProps) {
  const [isLinked, setIsLinked] = useState(initialIsLinked)
  const { execute, loading } = useApi(completeEndpoint)

  const role = useTeamRoleStore((s) => s.role)
  const isFrontend = role === 'FRONTEND'

  const handleLinkToggle = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isLinked || loading) return

    try {
      await execute(accordionProps.endpointId, flowImageId)
      setIsLinked(true)
    } catch (error) {
      console.error('연동 처리 실패:', error)
    }
  }

  if (!isFrontend)
    return (
      <div className='flex-1'>
        <ApiAccordionItem {...accordionProps} />
      </div>
    )

  return (
    <div className='flex items-start gap-3'>
      <div className='flex-1'>
        <ApiAccordionItem {...accordionProps} />
      </div>

      <button
        onClick={handleLinkToggle}
        disabled={isLinked || loading}
        title={isLinked ? '연동 완료' : '클릭하여 연동'}
        className={`mt-2 shrink-0 flex items-center gap-1 text-xs px-3 py-1.5 rounded-full border transition justify-center
  ${
    isLinked
      ? 'border-transparent bg-gray-800 text-white cursor-default'
      : 'border-gray-300 bg-white text-gray-400 hover:border-gray-400 hover:text-gray-600 cursor-pointer'
  }
  ${loading ? 'opacity-50 cursor-wait' : ''}
`}
      >
        {loading ? (
          <svg className='w-4 h-4 animate-spin' viewBox='0 0 24 24' fill='none'>
            <circle
              cx='12'
              cy='12'
              r='10'
              stroke='currentColor'
              strokeWidth='3'
              strokeDasharray='60'
              strokeDashoffset='20'
            />
          </svg>
        ) : isLinked ? (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z'
            />
          </svg>
        ) : (
          <svg
            className='w-4 h-4'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M13.828 10.172a4 4 0 0 0-5.656 0l-4 4a4 4 0 1 0 5.656 5.656l1.102-1.101'
            />
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M10.172 13.828a4 4 0 0 0 5.656 0l4-4a4 4 0 1 0-5.656-5.656l-1.101 1.102'
            />
            <line x1='3' y1='3' x2='21' y2='21' stroke='currentColor' strokeWidth='2' />
          </svg>
        )}
        <span>{isLinked ? '연동됨' : '미연동'}</span>
      </button>
    </div>
  )
}
