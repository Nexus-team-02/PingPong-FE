import { useEffect, useState } from 'react'
import useApi from '@/shared/hooks/useApi'
import { getQaCaseDetail, getAllExecuteResult, reRunQaCase } from '@/features/qa/api'
import { safeString } from '@/features/qa/utils'
import type { QaCase, QaCaseDetail, QaExecuteResult, HttpMethod } from '@/features/qa/types'

import QaCaseParameters from './QaCaseParameters'
import QaCaseRequestBody from './QaCaseRequestBody'
import QaCaseExecutionResult from './QaCaseExecutionResult'
import QaCaseResponses from './QaCaseResponses'
import QaCaseSecurity from './QaCaseSecurity'

interface Props {
  qaCase: QaCase
  method: HttpMethod
  expanded: boolean
  onToggle: () => void
  onRun: (qaId: number) => Promise<void>
  onSuccessChange: (qaId: number, success: boolean | null) => void
  runAllSignal: number
}

export default function QaCaseAccordion({
  qaCase,
  expanded,
  onToggle,
  onRun,
  onSuccessChange,
  runAllSignal,
}: Props) {
  const {
    data: detail,
    loading: detailLoading,
    execute: fetchDetail,
  } = useApi<QaCaseDetail>(getQaCaseDetail)
  const {
    data: executeResults,
    loading: executeResultsLoading,
    execute: fetchExecuteResults,
  } = useApi<QaExecuteResult[]>(getAllExecuteResult)
  const { execute: executeReRun, loading: reRunLoading } = useApi(reRunQaCase)

  const [isExecuting, setIsExecuting] = useState(false)
  const [localSuccess, setLocalSuccess] = useState<boolean | null>(qaCase.isSuccess)

  // Try it out state
  const [isTryItOut, setIsTryItOut] = useState(false)
  const [paramsInput, setParamsInput] = useState<Record<string, string>>({})
  const [headersInput, setHeadersInput] = useState<Record<string, string>>({})
  const [bodyInput, setBodyInput] = useState('')
  const [liveResult, setLiveResult] = useState<QaExecuteResult | null>(null)

  const isContentLoading = detailLoading || executeResultsLoading

  // 서버 데이터가 바뀌면 동기화
  useEffect(() => {
    setLocalSuccess(qaCase.isSuccess)
  }, [qaCase.isSuccess])

  // 펼칠 때 상세 데이터 패치
  useEffect(() => {
    if (!expanded) return
    if (!detail && !detailLoading) fetchDetail(qaCase.qaId)
    if (!executeResults && !executeResultsLoading) fetchExecuteResults(qaCase.qaId)
  }, [
    expanded,
    detail,
    detailLoading,
    fetchDetail,
    executeResults,
    executeResultsLoading,
    fetchExecuteResults,
    qaCase.qaId,
  ])

  // Try it out 초기값: detail 로드 완료 시 qaData로 채움
  useEffect(() => {
    if (!detail) return
    const { qaData, parameters } = detail

    const initialParams: Record<string, string> = {}
    parameters?.forEach((p) => {
      if (p.in === 'path' && qaData.pathVariables?.[p.name]) {
        initialParams[p.name] = qaData.pathVariables[p.name]
      }
      if (p.in === 'query' && qaData.queryParams?.[p.name]) {
        initialParams[p.name] = qaData.queryParams[p.name]
      }
    })
    setParamsInput(initialParams)
    setHeadersInput(qaData.headers ?? {})

    setBodyInput((prev) => {
      if (!prev && qaData.body) return qaData.body
      return prev
    })
  }, [detail])

  const handleTryItOutChange = (val: boolean) => {
    setIsTryItOut(val)
    if (!val) setLiveResult(null)
  }

  const handleParamChange = (name: string, value: string) => {
    setParamsInput((prev) => ({ ...prev, [name]: value }))
  }

  // Re-run execute (Try it out)
  const handleReRunExecute = async () => {
    if (!detail) return

    setLiveResult(null)

    const pathVariables: Record<string, string> = {}
    const queryParams: Record<string, string> = {}

    detail.parameters?.forEach((p) => {
      const value = paramsInput[p.name]
      if (!value) return
      if (p.in === 'path') pathVariables[p.name] = value
      if (p.in === 'query') queryParams[p.name] = value
    })

    try {
      const result = await executeReRun(qaCase.qaId, {
        pathVariables,
        queryParams,
        headers: headersInput,
        body: bodyInput,
      })
      setLiveResult(result)
    } catch (e) {
      console.error(e)
      const message = e instanceof Error ? e.message : '요청 중 오류가 발생했습니다.'
      setLiveResult({
        qaExecuteId: -1,
        httpStatus: 0,
        isSuccess: false,
        responseHeaders: {},
        responseBody: message,
        executedAt: new Date().toISOString(),
        durationMs: 0,
        expectedStatusCode: 0,
      })
    }
  }

  const executeSelf = async () => {
    if (isExecuting) return
    setIsExecuting(true)
    setLocalSuccess(null)
    onSuccessChange(qaCase.qaId, null)

    try {
      await onRun(qaCase.qaId)
      setLocalSuccess(true)
      onSuccessChange(qaCase.qaId, true)

      if (expanded) {
        await Promise.all([fetchDetail(qaCase.qaId), fetchExecuteResults(qaCase.qaId)])
      }
    } catch {
      setLocalSuccess(false)
      onSuccessChange(qaCase.qaId, false)
    } finally {
      setIsExecuting(false)
    }
  }

  // Run All 시그널
  useEffect(() => {
    if (runAllSignal > 0) executeSelf()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runAllSignal])

  const handleRunClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    executeSelf()
  }

  // ── Status icon ──────────────────────────────────────────────────────────────
  const statusIcon = isExecuting ? (
    <svg className='h-5 w-5 shrink-0 animate-spin text-gray-400' viewBox='0 0 24 24' fill='none'>
      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
      <path
        className='opacity-75'
        fill='currentColor'
        d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
      />
    </svg>
  ) : localSuccess === true ? (
    <svg className='h-5 w-5 shrink-0 text-[#3ecf7a]' viewBox='0 0 20 20' fill='none'>
      <circle cx='10' cy='10' r='9' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M6.5 10.5L8.5 12.5L13.5 7.5'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  ) : localSuccess === false ? (
    <svg className='h-5 w-5 shrink-0 text-[#e85454]' viewBox='0 0 20 20' fill='none'>
      <circle cx='10' cy='10' r='9' stroke='currentColor' strokeWidth='1.5' />
      <path
        d='M7 7L13 13M13 7L7 13'
        stroke='currentColor'
        strokeWidth='1.5'
        strokeLinecap='round'
      />
    </svg>
  ) : (
    <svg className='h-5 w-5 shrink-0 text-gray-300' viewBox='0 0 20 20' fill='none'>
      <circle cx='10' cy='10' r='9' stroke='currentColor' strokeWidth='1.5' />
      <path d='M6 10H14' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' />
    </svg>
  )

  return (
    <div className='rounded-xl border border-gray-100 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow'>
      {/* ── Header ───────────────────────────────────────────────────────────── */}
      <div
        onClick={onToggle}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        className='flex w-full cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:brightness-95'
      >
        {/* Chevron */}
        <span
          className={`transition-transform duration-200 ${expanded ? 'rotate-0' : '-rotate-90'}`}
        >
          <svg className='h-3.5 w-3.5 text-gray-600' viewBox='0 0 12 12' fill='none'>
            <path
              d='M2 4.5L6 8.5L10 4.5'
              stroke='currentColor'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        </span>

        {/* Status icon */}
        {statusIcon}

        {/* Scenario name */}
        <span className='flex-1 text-left text-sm font-medium text-gray-700'>
          {safeString(qaCase.scenarioName)}
        </span>

        {/* Run button */}
        <button
          onClick={handleRunClick}
          disabled={isExecuting}
          className='flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-gray-900 transition-colors hover:bg-gray-700 disabled:cursor-wait disabled:opacity-50'
        >
          <svg className='ml-0.5 h-4 w-4 text-white' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M4 3.5L13 8L4 12.5V3.5Z' />
          </svg>
        </button>
      </div>

      {/* ── Expanded body ─────────────────────────────────────────────────────── */}
      {expanded && (
        <div className='space-y-3 border-t border-gray-300 px-4 py-4'>
          {isContentLoading && (
            <div className='space-y-2'>
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className='h-20 animate-pulse rounded-lg border border-gray-100 bg-white'
                />
              ))}
            </div>
          )}

          {!isContentLoading && (!detail || !executeResults) && (
            <div className='flex items-center justify-center py-6 text-xs text-gray-400'>
              Failed to load detail.
              <button
                onClick={() => {
                  if (!detail) fetchDetail(qaCase.qaId)
                  if (!executeResults) fetchExecuteResults(qaCase.qaId)
                }}
                className='ml-1 underline hover:no-underline'
              >
                Retry
              </button>
            </div>
          )}

          {detail && executeResults && (
            <>
              <QaCaseParameters
                detail={detail}
                isTryItOut={isTryItOut}
                setIsTryItOut={handleTryItOutChange}
                paramsInput={paramsInput}
                handleParamChange={handleParamChange}
                handleExecute={handleReRunExecute}
                executeLoading={reRunLoading}
              />

              <QaCaseRequestBody
                detail={detail}
                isTryItOut={isTryItOut}
                bodyInput={bodyInput}
                setBodyInput={setBodyInput}
              />

              {/* Try it out 실행 결과 (우선 표시) */}
              {liveResult && <QaCaseExecutionResult result={liveResult} isLive />}

              {/* 기존 최신 결과 */}
              {!liveResult && <QaCaseExecutionResult result={executeResults[0]} />}

              <QaCaseResponses detail={detail} />
              <QaCaseSecurity detail={detail} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
