import { useCallback, useEffect, useMemo, useState } from 'react' // useRef 제거
import { useOutletContext, useParams } from 'react-router-dom'
import useApi from '@/shared/hooks/useApi'
import QaNavigator from '@/features/qa/components/QaNavigator'
import type { TeamLayoutContext } from '@/layouts/TeamLayout'
import { getQaCases, executeQaCase } from '../api'
import type { QaCase, QaEndpoint } from '../types'
import { METHOD_STYLE } from '../utils'
import QaCaseAccordion from '../components/QaCaseAccordion/QaCaseAccordion'

export default function QaPage() {
  const { setDynamicTitle, setDynamicSubtitle } = useOutletContext<TeamLayoutContext>()
  const { teamId } = useParams()

  useEffect(() => {
    setDynamicTitle('')
    setDynamicSubtitle('')
  }, [setDynamicTitle, setDynamicSubtitle])

  const [selectedEndpoint, setSelectedEndpoint] = useState<QaEndpoint | null>(() => {
    try {
      const saved = localStorage.getItem('qa-selected-endpoint')
      return saved ? (JSON.parse(saved) as QaEndpoint) : null
    } catch {
      return null
    }
  })
  const [expandedCases, setExpandedCases] = useState<Set<number>>(new Set())
  const [runAllSignal, setRunAllSignal] = useState(0)

  const [localSuccessMap, setLocalSuccessMap] = useState<
    Record<number, boolean | null | undefined>
  >({})

  const {
    data: cases,
    loading: casesLoading,
    error: casesError,
    execute: fetchCases,
  } = useApi<QaCase[]>(getQaCases)

  const { execute: runCase } = useApi<unknown>(executeQaCase)

  useEffect(() => {
    if (!selectedEndpoint) return

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }, [selectedEndpoint])

  useEffect(() => {
    if (!selectedEndpoint) return
    fetchCases(selectedEndpoint.endpointId)
  }, [selectedEndpoint, fetchCases])

  const handleSelectEndpoint = useCallback((endpoint: QaEndpoint) => {
    setSelectedEndpoint(endpoint)
    setExpandedCases(new Set())
    setLocalSuccessMap({})
    setRunAllSignal(0)
    localStorage.setItem('qa-selected-endpoint', JSON.stringify(endpoint))
  }, [])

  const toggleCase = useCallback((id: number) => {
    setExpandedCases((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }, [])

  const handleRunAll = useCallback(() => {
    if (!cases?.length) return
    setRunAllSignal((prev) => prev + 1)
  }, [cases])

  const handleRunCase = useCallback(
    async (qaId: number) => {
      await runCase(qaId)
    },
    [runCase],
  )

  const handleSuccessChange = useCallback((qaId: number, success: boolean | null) => {
    setLocalSuccessMap((prev) => ({ ...prev, [qaId]: success }))
  }, [])

  const { passedCount, totalCount } = useMemo(() => {
    if (!cases) return { passedCount: 0, totalCount: 0 }
    const passed = cases.filter((c) => {
      const local = localSuccessMap[c.qaId]
      return local !== undefined ? local === true : c.isSuccess
    }).length
    return { passedCount: passed, totalCount: cases.length }
  }, [cases, localSuccessMap])

  const getPassedBadgeColor = () => {
    if (totalCount === 0) return 'bg-gray-100 text-gray-500'
    if (passedCount === totalCount) return 'bg-[#3ecf7a]/10 text-[#3ecf7a]'
    if (passedCount === 0) return 'bg-[#e85454]/10 text-[#e85454]'
    return 'bg-[#f5a623]/10 text-[#f5a623]'
  }
  const passedBadgeColor = getPassedBadgeColor()

  return (
    <div className='flex h-screen overflow-hidden pt-16'>
      <div className='animate-fade-in h-full'>
        <QaNavigator
          teamId={Number(teamId)}
          selectedEndpointId={selectedEndpoint?.endpointId ?? null}
          onSelectEndpoint={handleSelectEndpoint}
        />
      </div>

      <main className='flex-1 overflow-y-auto px-6 py-5 scrollbar-hide'>
        {!selectedEndpoint ? (
          <div className='flex h-full flex-col items-center justify-center text-gray-400'>
            <p className='text-sm'>Select an endpoint from the left panel</p>
          </div>
        ) : (
          <>
            <div className='mb-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-3.5 shadow-sm animate-fade-up'>
              <span
                className={`rounded-full px-4 py-1.5 text-sm font-bold text-white ${METHOD_STYLE[selectedEndpoint.method]?.badge ?? 'bg-gray-500'}`}
              >
                {selectedEndpoint.method}
              </span>
              <span className='text-sm font-semibold text-gray-800'>{selectedEndpoint.path}</span>

              {!casesLoading && cases && (
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${passedBadgeColor}`}>
                  {passedCount} / {totalCount} passed
                </span>
              )}

              <button
                onClick={handleRunAll}
                disabled={casesLoading || !cases?.length}
                className='cursor-pointer ml-auto flex items-center gap-2 rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50'
              >
                Run All
                <svg className='ml-0.5 h-4 w-4' viewBox='0 0 16 16' fill='currentColor'>
                  <path d='M4 3.5L13 8L4 12.5V3.5Z' />
                </svg>
              </button>
            </div>

            {casesLoading && !cases && (
              <div className='space-y-2'>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='h-14 animate-pulse rounded-xl border border-gray-100 bg-white'
                  />
                ))}
              </div>
            )}

            {casesError && !cases && (
              <div className='flex h-48 flex-col items-center justify-center gap-2 text-gray-400'>
                <p className='text-sm'>Failed to load QA cases.</p>
                <button
                  onClick={() => fetchCases(selectedEndpoint.endpointId)}
                  className='text-xs text-gray-600 underline hover:no-underline'
                >
                  Retry
                </button>
              </div>
            )}

            {cases && (
              <>
                {cases.length > 0 ? (
                  <div className='space-y-2'>
                    {cases.map((qaCase) => (
                      <QaCaseAccordion
                        key={qaCase.qaId}
                        qaCase={qaCase}
                        method={selectedEndpoint.method}
                        expanded={expandedCases.has(qaCase.qaId)}
                        onToggle={() => toggleCase(qaCase.qaId)}
                        onRun={handleRunCase}
                        onSuccessChange={handleSuccessChange}
                        runAllSignal={runAllSignal}
                      />
                    ))}
                  </div>
                ) : (
                  <div className='flex h-48 flex-col items-center justify-center text-gray-400 animate-fade-up'>
                    <svg
                      className='mb-2 h-10 w-10 opacity-40'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='1.5'
                    >
                      <path
                        d='M9 12h6M9 16h6M9 8h3M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                    <p className='text-sm'>No QA cases found for this endpoint</p>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </main>
    </div>
  )
}
