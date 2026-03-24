import { memo } from 'react'
import type { QaCaseDetail } from '@/features/qa/types'
import { safeString } from '@/features/qa/utils'
import QaCaseSection from './QaCaseSection'

interface Props {
  detail: QaCaseDetail
}

const QaCaseResponses = memo(function QaCaseResponses({ detail }: Props) {
  const { responses } = detail

  if (!responses?.length) return null

  return (
    <QaCaseSection title='Responses'>
      <div className='space-y-4'>
        {responses.map((res) => {
          const parsedSchema = (() => {
            try {
              return JSON.parse(res.schema)
            } catch {
              return res.schema
            }
          })()

          return (
            <div key={res.statusCode} className='space-y-1.5'>
              <div className='flex items-center gap-3'>
                <span className='font-bold text-gray-900'>{res.statusCode}</span>
                <span className='text-sm text-gray-500'>{safeString(res.description)}</span>
              </div>
              <div className='text-xs text-gray-400'>
                Media type: <span className='font-medium text-gray-600'>{res.mediaType}</span>
              </div>
              {res.schema && (
                <pre className='max-h-48 overflow-auto rounded-md bg-[#1e293b] p-3 text-xs leading-relaxed text-slate-50'>
                  <code>{JSON.stringify(parsedSchema, null, 2)}</code>
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </QaCaseSection>
  )
})

export default QaCaseResponses
