import { memo } from 'react'
import { DiffItem, ApiResponse, HttpMethod } from '@/features/backend/types/swagger'
import Section from '../ApiAccordion/Section'

const DIFF_WRAP_STYLE = {
  ADDED: 'border-l-4 border-green-400 bg-green-50 rounded-md',
  DELETED: 'border-l-4 border-red-400 bg-red-50 rounded-md opacity-75',
  MODIFIED: 'border-l-4 border-amber-400 bg-amber-50 rounded-md',
  UNCHANGED: 'border-l-4 border-transparent',
} as const

const DIFF_BADGE = {
  ADDED: <span className='ml-2 text-xs font-bold text-green-600'>+ ADDED</span>,
  DELETED: <span className='ml-2 text-xs font-bold text-red-500'>- DELETED</span>,
  MODIFIED: null,
  UNCHANGED: null,
} as const

interface ResponseBlockProps {
  response: ApiResponse
  diffType: keyof typeof DIFF_WRAP_STYLE
  subLabel?: 'BEFORE' | 'AFTER'
}

function ResponseBlock({ response, diffType, subLabel }: ResponseBlockProps) {
  const wrapStyle = subLabel
    ? subLabel === 'BEFORE'
      ? DIFF_WRAP_STYLE.DELETED
      : DIFF_WRAP_STYLE.ADDED
    : DIFF_WRAP_STYLE[diffType]

  return (
    <div className={`space-y-2 p-2 ${wrapStyle}`}>
      <div className='flex items-center gap-3'>
        <span className='font-bold text-gray-900'>{response.statusCode}</span>
        <span className='text-sm text-gray-600'>{response.description}</span>
        {subLabel === 'BEFORE' && <span className='text-xs font-bold text-red-500'>- BEFORE</span>}
        {subLabel === 'AFTER' && <span className='text-xs font-bold text-green-600'>+ AFTER</span>}
        {!subLabel && DIFF_BADGE[diffType]}
      </div>
      <div className='text-xs text-gray-500'>
        Media type: <span className='font-medium text-gray-700'>{response.mediaType}</span>
      </div>
      {response.schema && (
        <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
          <code>{JSON.stringify(response.schema, null, 2)}</code>
        </pre>
      )}
    </div>
  )
}

interface Props {
  responses: DiffItem<ApiResponse>[]
  method: HttpMethod
}

const ApiDiffResponses = memo(function ApiDiffResponses({ responses, method }: Props) {
  if (!responses?.length) return null

  return (
    <Section title='Responses' method={method}>
      <div className='space-y-6'>
        {responses.map((item, i) => {
          if (item.diffType === 'MODIFIED') {
            return (
              <div key={i} className='space-y-2'>
                {item.before && (
                  <ResponseBlock response={item.before} diffType='MODIFIED' subLabel='BEFORE' />
                )}
                {item.after && (
                  <ResponseBlock response={item.after} diffType='MODIFIED' subLabel='AFTER' />
                )}
              </div>
            )
          }
          const res = item.after ?? item.before
          return res ? <ResponseBlock key={i} response={res} diffType={item.diffType} /> : null
        })}
      </div>
    </Section>
  )
})

export default ApiDiffResponses
