import { DiffItem, ApiRequest, HttpMethod } from '@/features/backend/types/swagger'
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

interface RequestBlockProps {
  request: ApiRequest
  diffType: keyof typeof DIFF_WRAP_STYLE
  subLabel?: 'BEFORE' | 'AFTER'
}

function RequestBlock({ request, diffType, subLabel }: RequestBlockProps) {
  const wrapStyle = subLabel
    ? subLabel === 'BEFORE'
      ? DIFF_WRAP_STYLE.DELETED
      : DIFF_WRAP_STYLE.ADDED
    : DIFF_WRAP_STYLE[diffType]

  return (
    <div className={`space-y-2 p-2 ${wrapStyle}`}>
      <div className='text-sm font-medium text-gray-700'>
        {request.mediaType}
        {request.required && <span className='ml-2 text-xs text-red-500'>* required</span>}
        {subLabel === 'BEFORE' && (
          <span className='ml-2 text-xs font-bold text-red-500'>- BEFORE</span>
        )}
        {subLabel === 'AFTER' && (
          <span className='ml-2 text-xs font-bold text-green-600'>+ AFTER</span>
        )}
        {!subLabel && DIFF_BADGE[diffType]}
      </div>
      <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
        <code>{request.schema ? JSON.stringify(request.schema, null, 2) : '(no schema)'}</code>
      </pre>
    </div>
  )
}

interface Props {
  requests: DiffItem<ApiRequest>[]
  method: HttpMethod
}

export default function ApiDiffRequestBody({ requests, method }: Props) {
  if (!requests?.length) return null

  return (
    <Section title='Request Body' method={method}>
      <div className='space-y-4'>
        {requests.map((item, i) => {
          if (item.diffType === 'MODIFIED') {
            return (
              <div key={i} className='space-y-2'>
                {item.before && (
                  <RequestBlock request={item.before} diffType='MODIFIED' subLabel='BEFORE' />
                )}
                {item.after && (
                  <RequestBlock request={item.after} diffType='MODIFIED' subLabel='AFTER' />
                )}
              </div>
            )
          }
          const req = item.after ?? item.before
          return req ? <RequestBlock key={i} request={req} diffType={item.diffType} /> : null
        })}
      </div>
    </Section>
  )
}
