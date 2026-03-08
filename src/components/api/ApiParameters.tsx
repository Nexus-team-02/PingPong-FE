import { HttpMethod, ApiParameter } from '@/types/api'
import Section from './Section'

interface ApiParametersProps {
  parameters: ApiParameter[]
  method: HttpMethod
  isTryItOut: boolean
  setIsTryItOut: (val: boolean) => void
  paramsInput: Record<string, string>
  handleParamChange: (name: string, value: string) => void
  handleExecute: () => void
  executeLoading: boolean
}

export default function ApiParameters({
  parameters,
  method,
  isTryItOut,
  setIsTryItOut,
  paramsInput,
  handleParamChange,
  handleExecute,
  executeLoading,
}: ApiParametersProps) {
  return (
    <>
      {parameters?.length > 0 && parameters[0].description && (
        <p className='text-sm text-gray-700'>{parameters[0].description}</p>
      )}

      <Section
        title='Parameters'
        method={method}
        rightElement={
          <button
            onClick={() => setIsTryItOut(!isTryItOut)}
            className='cursor-pointer rounded border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100'
          >
            {isTryItOut ? 'Cancel' : 'Try it out'}
          </button>
        }
      >
        {!parameters || parameters.length === 0 ? (
          <div className='py-4 text-center text-sm italic text-gray-500'>No parameters</div>
        ) : (
          <div className='space-y-4'>
            <div className='grid grid-cols-4 gap-4 border-b pb-2 text-xs font-semibold text-gray-500'>
              <div className='col-span-1'>Name</div>
              <div className='col-span-3'>Description</div>
            </div>

            <div className='space-y-4'>
              {parameters.map((p) => (
                <div key={p.name} className='grid grid-cols-4 gap-4 text-sm'>
                  <div className='col-span-1 wrap-break-word'>
                    <div className='font-semibold text-gray-900'>
                      {p.name}
                      {p.required && <span className='ml-1 text-red-500'>*</span>}
                    </div>
                    <div className='mt-1 text-xs text-gray-500'>{p.type}</div>
                    <div className='text-xs italic text-gray-400'>({p.in})</div>
                  </div>
                  <div className='col-span-3 text-gray-700'>
                    {isTryItOut ? (
                      <div className='mt-2'>
                        <input
                          type='text'
                          placeholder={p.name}
                          value={paramsInput[p.name] || ''}
                          onChange={(e) => handleParamChange(p.name, e.target.value)}
                          className='w-50 rounded border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                        />
                      </div>
                    ) : (
                      p.description || <span className='text-gray-400'>-</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isTryItOut && (
          <div className='mt-6 border-t pt-4'>
            <button
              onClick={handleExecute}
              className='w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 sm:w-auto'
            >
              {executeLoading ? 'Executing...' : 'Execute'}
            </button>
          </div>
        )}
      </Section>
    </>
  )
}
