import { memo } from 'react'
import type { QaCaseDetail } from '@/features/qa/types'
import QaCaseSection from './QaCaseSection'

interface Props {
  detail: QaCaseDetail
}

const QaCaseSecurity = memo(function QaCaseSecurity({ detail }: Props) {
  const { security } = detail

  if (!security?.length) return null

  return (
    <QaCaseSection title='Security'>
      <div className='space-y-2'>
        {security.map((s, i) => (
          <div
            key={i}
            className='space-y-1 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm'
          >
            <div>
              <span className='font-semibold text-gray-600'>Type:</span> {s.type}
            </div>
            <div>
              <span className='font-semibold text-gray-600'>Scheme:</span> {s.scheme}
            </div>
            {s.headerName && (
              <div>
                <span className='font-semibold text-gray-600'>Header:</span> {s.headerName}
              </div>
            )}
            {s.bearerFormat && (
              <div>
                <span className='font-semibold text-gray-600'>Format:</span> {s.bearerFormat}
              </div>
            )}
          </div>
        ))}
      </div>
    </QaCaseSection>
  )
})

export default QaCaseSecurity
