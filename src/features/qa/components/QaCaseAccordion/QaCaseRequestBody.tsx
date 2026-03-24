import { memo, Dispatch, SetStateAction, useEffect } from 'react'
import type { QaCaseDetail } from '@/features/qa/types'
import { formatBody, safeString } from '@/features/qa/utils'
import QaCaseSection from './QaCaseSection'

interface Props {
  detail: QaCaseDetail
  isTryItOut: boolean
  bodyInput: string
  setBodyInput: Dispatch<SetStateAction<string>>
}

const QaCaseRequestBody = memo(function QaCaseRequestBody({
  detail,
  isTryItOut,
  bodyInput,
  setBodyInput,
}: Props) {
  const { requests, qaData } = detail

  useEffect(() => {
    if (isTryItOut) {
      setBodyInput((prev) => {
        if (!prev && qaData.body) return formatBody(qaData.body) ?? ''
        return prev
      })
    }
  }, [isTryItOut, qaData.body, setBodyInput])

  if (!requests?.length) return null

  const parsedSchema = (() => {
    try {
      return JSON.parse(requests[0].schema)
    } catch {
      return requests[0].schema
    }
  })()

  const actualBody = formatBody(qaData.body)

  return (
    <QaCaseSection title='Request Body'>
      <div className='space-y-3'>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-medium text-gray-500'>{requests[0].mediaType}</span>
          {requests[0].required && (
            <span className='text-[10px] font-medium text-red-500'>* required</span>
          )}
        </div>

        {isTryItOut ? (
          <div>
            <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
              Edit Body
            </div>
            <textarea
              value={bodyInput}
              onChange={(e) => setBodyInput(e.target.value)}
              className='w-full rounded border border-gray-300 p-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
              rows={10}
            />
          </div>
        ) : (
          <>
            {qaData.body && (
              <div>
                <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
                  QA Test Value
                </div>
                <pre className='max-h-48 overflow-auto rounded-md bg-gray-800 p-3 font-mono text-xs leading-relaxed text-green-300'>
                  {safeString(actualBody)}
                </pre>
              </div>
            )}

            <div>
              <div className='mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400'>
                Schema
              </div>
              <pre className='max-h-48 overflow-auto rounded-md bg-[#1e293b] p-3 font-mono text-xs leading-relaxed text-slate-50'>
                <code>{JSON.stringify(parsedSchema, null, 2)}</code>
              </pre>
            </div>
          </>
        )}
      </div>
    </QaCaseSection>
  )
})

export default QaCaseRequestBody
