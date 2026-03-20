import { memo } from 'react'
import { HttpMethod, ApiSecurityRequirement } from '@/types/api'
import Section from './Section'

interface ApiSecurityProps {
  security: ApiSecurityRequirement[]
  method: HttpMethod
}

const ApiSecurity = memo(function ApiSecurity({ security, method }: ApiSecurityProps) {
  if (!security || security.length === 0) return null

  return (
    <Section title='Security' method={method}>
      <div className='space-y-3'>
        {security.map((s, i) => (
          <div key={i} className='flex flex-col gap-1 rounded bg-gray-50 p-3 text-sm'>
            <div>
              <span className='font-semibold text-gray-700'>Type:</span> {s.type}
            </div>
            <div>
              <span className='font-semibold text-gray-700'>Scheme:</span> {s.scheme}
            </div>
            {s.headerName && (
              <div>
                <span className='font-semibold text-gray-700'>Header:</span> {s.headerName}
              </div>
            )}
            {s.bearerFormat && (
              <div>
                <span className='font-semibold text-gray-700'>Format:</span> {s.bearerFormat}
              </div>
            )}
          </div>
        ))}
      </div>
    </Section>
  )
})

export default ApiSecurity
