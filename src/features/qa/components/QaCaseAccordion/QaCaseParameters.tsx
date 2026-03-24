import { memo } from 'react'
import type { QaCaseDetail } from '@/features/qa/types'
import { safeString } from '@/features/qa/utils'
import QaCaseSection from './QaCaseSection'

interface Props {
  detail: QaCaseDetail
  isTryItOut: boolean
  setIsTryItOut: (val: boolean) => void
  paramsInput: Record<string, string>
  handleParamChange: (name: string, value: string) => void
  handleExecute: () => void
  executeLoading: boolean
}

const QaCaseParameters = memo(function QaCaseParameters({
  detail,
  isTryItOut,
  setIsTryItOut,
  paramsInput,
  handleParamChange,
  handleExecute,
  executeLoading,
}: Props) {
  const { parameters, qaData } = detail

  if (!parameters?.length) return null

  const getDisplayValue = (name: string, inType: string): string | undefined => {
    if (inType === 'path') return qaData.pathVariables?.[name]
    if (inType === 'query') return qaData.queryParams?.[name]
    if (inType === 'header') return qaData.headers?.[name]
    return undefined
  }

  return (
    <QaCaseSection
      title='Parameters'
      rightElement={
        <button
          onClick={() => setIsTryItOut(!isTryItOut)}
          className='cursor-pointer rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100'
        >
          {isTryItOut ? 'Cancel' : 'Try it out'}
        </button>
      }
    >
      <div className='space-y-3'>
        <div className='grid grid-cols-4 gap-4 border-b border-gray-100 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400'>
          <div className='col-span-1'>Name</div>
          <div className='col-span-3'>Value / Description</div>
        </div>

        {parameters.map((p) => {
          const displayValue = getDisplayValue(p.name, p.in)
          return (
            <div key={p.name} className='grid grid-cols-4 gap-4 text-sm'>
              <div className='col-span-1'>
                <div className='font-semibold text-gray-900'>
                  {p.name}
                  {p.required && <span className='ml-0.5 text-red-500'>*</span>}
                </div>
                <div className='mt-0.5 text-xs text-gray-400'>{p.type}</div>
                <div className='text-xs italic text-gray-400'>({p.in})</div>
              </div>

              <div className='col-span-3 text-gray-700'>
                {isTryItOut ? (
                  <div className='mt-1'>
                    <input
                      type='text'
                      placeholder={p.exampleValue || p.name}
                      value={paramsInput[p.name] || ''}
                      onChange={(e) => handleParamChange(p.name, e.target.value)}
                      className='w-50 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                    />
                  </div>
                ) : displayValue !== undefined ? (
                  <span className='rounded border border-blue-100 bg-blue-50 px-2 py-0.5 font-mono text-xs text-blue-700'>
                    {safeString(displayValue)}
                  </span>
                ) : (
                  <span className='text-xs italic text-gray-400'>
                    {p.description || p.exampleValue || '—'}
                  </span>
                )}
              </div>
            </div>
          )
        })}

        {isTryItOut && (
          <div className='mt-4 border-t border-gray-100 pt-4'>
            <button
              onClick={handleExecute}
              disabled={executeLoading}
              className='rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-wait disabled:opacity-60 sm:w-auto'
            >
              {executeLoading ? 'Executing...' : 'Execute'}
            </button>
          </div>
        )}
      </div>
    </QaCaseSection>
  )
})

export default QaCaseParameters
