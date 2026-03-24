import { memo } from 'react'
import type { QaExecuteResult } from '@/features/qa/types'
import { parseResponseBody, safeString } from '@/features/qa/utils'
import QaCaseSection from './QaCaseSection'

interface Props {
  result?: QaExecuteResult
  isLive?: boolean
}

const QaCaseExecutionResult = memo(function QaCaseExecutionResult({ result, isLive }: Props) {
  if (!result) return null

  const statusColor =
    result.httpStatus >= 200 && result.httpStatus < 300
      ? 'text-[#3ecf7a]'
      : result.httpStatus >= 400
        ? 'text-[#e85454]'
        : 'text-[#f5a623]'

  const parsedBody = parseResponseBody(result.responseBody)
  const executedAt = new Date(result.executedAt).toLocaleString()

  return (
    <QaCaseSection
      title={isLive ? 'Execution Result (Live)' : 'Latest Execution Result'}
      rightElement={
        isLive ? (
          <span className='rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-blue-500'>
            Live
          </span>
        ) : undefined
      }
    >
      <div className='space-y-3'>
        {/* Status row */}
        <div className='flex flex-wrap items-center gap-3 text-xs'>
          <span className={`text-base font-bold ${statusColor}`}>{result.httpStatus}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              result.isSuccess ? 'bg-[#3ecf7a]/10 text-[#3ecf7a]' : 'bg-[#e85454]/10 text-[#e85454]'
            }`}
          >
            {result.isSuccess ? 'PASS' : 'FAIL'}
          </span>
          <span className='text-gray-400'>Expected: {result.expectedStatusCode}</span>
          <span className='text-gray-400'>{result.durationMs}ms</span>
          <span className='ml-auto text-gray-400'>{executedAt}</span>
        </div>

        {/* Response Headers */}
        {result.responseHeaders && Object.keys(result.responseHeaders).length > 0 && (
          <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
              Response Headers
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {Object.entries(result.responseHeaders).map(([k, v]) => (
                <span
                  key={k}
                  className='rounded border border-purple-100 bg-purple-50 px-2 py-0.5 font-mono text-[11px] text-purple-700'
                >
                  {k}: {safeString(v)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Response Body */}
        <div>
          <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
            Response Body
          </div>
          <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-3 text-xs leading-relaxed text-slate-50'>
            <code>{parsedBody || '(empty)'}</code>
          </pre>
        </div>
      </div>
    </QaCaseSection>
  )
})

export default QaCaseExecutionResult
