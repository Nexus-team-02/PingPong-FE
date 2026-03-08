import { memo } from 'react'
import Section from './Section'
import { HttpMethod, ApiResponse } from '@/types/api'

const ApiResponses = memo(
  ({ responses, method }: { responses: ApiResponse[]; method: HttpMethod }) => {
    if (!responses?.length) return null

    return (
      <Section title='Responses' method={method}>
        <div className='space-y-6'>
          {responses.map((res) => (
            <div key={res.statusCode} className='space-y-2'>
              <div className='flex items-center gap-3'>
                <span className='font-bold text-gray-900'>{res.statusCode}</span>
                <span className='text-sm text-gray-600'>{res.description}</span>
              </div>
              <div className='text-xs text-gray-500'>
                Media type: <span className='font-medium text-gray-700'>{res.mediaType}</span>
              </div>
              {res.schema && (
                <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
                  <code>{JSON.stringify(res.schema, null, 2)}</code>
                </pre>
              )}
            </div>
          ))}
        </div>
      </Section>
    )
  },
)

export default ApiResponses
