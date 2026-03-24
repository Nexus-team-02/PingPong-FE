import { useEffect, useState } from 'react'
import { getTags } from '../api'
import useApi from '@/shared/hooks/useApi'
import type { HttpMethod, QaEndpoint, QaTag } from '../types'
import { METHOD_STYLE, successRateColor } from '../utils'
import { useApiAuthStore } from '@/shared/stores/apiAuthStore'
import AuthorizeModal from '@/features/backend/components/swagger/AuthorizeModal'
import Lock from '@/assets/lock.svg?react'

// ─── Sub-components ───────────────────────────────────────────────────────────

export function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide ${METHOD_STYLE[method].badge}`}
    >
      {method}
    </span>
  )
}

export function SuccessRateBar({ rate }: { rate: number }) {
  return (
    <div className='mt-1 flex items-center gap-2'>
      <div className='h-1.5 flex-1 rounded-full bg-black/10 overflow-hidden'>
        <div
          className={`h-full rounded-full transition-all duration-500 ${successRateColor(rate)}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className='text-[10px] text-gray-500 w-7 text-right'>{Math.round(rate)}%</span>
    </div>
  )
}

// ─── Navigator ────────────────────────────────────────────────────────────────

interface QaNavigatorProps {
  teamId: number
  selectedEndpointId: number | null
  onSelectEndpoint: (endpoint: QaEndpoint) => void
}

export default function QaNavigator({
  teamId,
  selectedEndpointId,
  onSelectEndpoint,
}: QaNavigatorProps) {
  const { data: tags, loading, error, execute: fetchTags } = useApi<QaTag[]>(getTags)
  const [collapsedTags, setCollapsedTags] = useState<Set<string>>(new Set())

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const token = useApiAuthStore((s) => s.token)

  useEffect(() => {
    fetchTags(teamId)
  }, [teamId, fetchTags])

  const toggleTag = (tag: string) => {
    setCollapsedTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) {
        next.delete(tag)
      } else {
        next.add(tag)
      }
      return next
    })
  }

  return (
    <>
      <aside className='flex flex-col w-64 shrink-0 overflow-hidden bg-[#dff0e8] border-r border-[#c5dfd0]'>
        <div className='px-4 pt-5 pb-3'>
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-xs font-bold uppercase tracking-widest text-gray-500'>
              API Explorer
            </h2>

            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-bold transition-colors ${
                token
                  ? 'border-api-green bg-api-green-sub text-api-green'
                  : 'border-gray-400 bg-transparent text-gray-600 hover:bg-black/5'
              }`}
            >
              {token ? 'Authorized' : 'Authorize'}
              <Lock className={`w-3 h-3 ${token ? 'text-api-green' : 'text-gray-500'}`} />
            </button>
          </div>
        </div>

        <div className='flex-1 overflow-y-auto px-4 pb-5'>
          {loading && (
            <div className='flex flex-col gap-3'>
              {[1, 2, 3].map((i) => (
                <div key={i} className='animate-pulse space-y-1.5'>
                  <div className='h-4 w-20 rounded bg-black/10' />
                  <div className='ml-3 space-y-1'>
                    <div className='h-8 rounded-lg bg-black/10' />
                    <div className='h-8 rounded-lg bg-black/10' />
                  </div>
                </div>
              ))}
            </div>
          )}

          {error && (
            <div className='rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-600'>
              Failed to load endpoints.{' '}
              <button
                onClick={() => fetchTags(teamId)}
                className='font-semibold underline hover:no-underline'
              >
                Retry
              </button>
            </div>
          )}

          {tags && (
            <div className='space-y-4'>
              {tags.map((tagGroup) => (
                <div key={tagGroup.tag}>
                  <button
                    onClick={() => toggleTag(tagGroup.tag)}
                    className='flex w-full items-center gap-2 mb-1 group'
                  >
                    <svg
                      className='w-3.5 h-3.5 text-gray-700'
                      viewBox='0 0 16 16'
                      fill='currentColor'
                    >
                      <path d='M2 3h12v2H2zM2 7h12v2H2zM2 11h8v2H2z' />
                    </svg>
                    <span className='text-sm font-bold text-gray-800 group-hover:text-gray-900'>
                      {tagGroup.tag}
                    </span>
                    <svg
                      className={`ml-auto w-3 h-3 text-gray-400 transition-transform duration-200 ${collapsedTags.has(tagGroup.tag) ? '-rotate-90' : ''}`}
                      viewBox='0 0 12 12'
                      fill='none'
                    >
                      <path
                        d='M2 4L6 8L10 4'
                        stroke='currentColor'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                      />
                    </svg>
                  </button>

                  {!collapsedTags.has(tagGroup.tag) && (
                    <div className='ml-2 border-l border-[#b0d0bc] pl-3 space-y-0.5'>
                      {tagGroup.endpoints.map((ep) => {
                        const isSelected = selectedEndpointId === ep.endpointId
                        return (
                          <button
                            key={ep.endpointId}
                            onClick={() => onSelectEndpoint(ep)}
                            className={`w-full rounded-lg px-2 py-2 text-left transition-all ${
                              isSelected ? 'bg-white shadow-sm' : 'hover:bg-white/50'
                            }`}
                          >
                            <div className='flex items-center gap-1.5'>
                              <MethodBadge method={ep.method} />
                              <span
                                className={`text-xs font-medium truncate ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}
                              >
                                {ep.path}
                              </span>
                            </div>
                            <SuccessRateBar rate={ep.successRate} />
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {isAuthModalOpen && <AuthorizeModal onClose={() => setIsAuthModalOpen(false)} />}
    </>
  )
}
