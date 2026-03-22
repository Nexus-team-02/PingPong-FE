import { useState } from 'react'
import Open from '@/assets/up.svg?react'
import Spinner from '../../common/Spinner'
import { getDiffDetailsEndpoint } from '@/api/swagger'
import useApi from '@/hook/useApi'
import { HttpMethod } from '@/types/api'
import { METHOD_STYLE } from '@/constants/method'

import ApiDiffParameters from './ApiDiffParameters'
import ApiDiffRequestBody from './ApiDiffRequestBody'
import ApiDiffResponses from './ApiDiffResponses'

interface Props {
  method: HttpMethod
  path: string
  summary?: string
  endpointId: number
}

export default function ApiDiffAccordionItem({ method, path, summary, endpointId }: Props) {
  const { execute, data, loading } = useApi(getDiffDetailsEndpoint)
  const [open, setOpen] = useState(false)

  const handleToggle = async () => {
    const next = !open
    setOpen(next)

    if (next && !data) {
      await execute(endpointId)
    }
  }

  return (
    <div className={`overflow-hidden rounded-md border ${METHOD_STYLE[method].border}`}>
      <button
        onClick={handleToggle}
        className={`flex w-full cursor-pointer items-center gap-3 px-3 py-2 transition-colors hover:brightness-95 ${METHOD_STYLE[method].bg}`}
      >
        <span
          className={`min-w-16 rounded px-3 py-1.5 pt-1.75 text-center text-xs font-bold text-white ${METHOD_STYLE[method].badge}`}
        >
          {method}
        </span>

        <span className='text-sm font-medium text-gray-900'>{path}</span>
        {summary && <span className='text-xs text-gray-600 mt-1'>{summary}</span>}

        <span className={`ml-auto transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          <Open className={`${METHOD_STYLE[method].text} h-5 w-5`} />
        </span>
      </button>

      {open && (
        <div
          className={`space-y-4 border-t px-4 py-6 ${METHOD_STYLE[method].border} ${METHOD_STYLE[method].bg}`}
        >
          {loading && <Spinner />}

          {data && (
            <>
              <div className='flex items-center gap-4 text-xs text-gray-500 pb-1 pl-1'>
                <span className='flex items-center gap-1'>
                  <span className='font-mono font-bold text-green-600'>+</span> Added
                </span>
                <span className='flex items-center gap-1'>
                  <span className='font-mono font-bold text-red-500'>-</span> Deleted
                </span>
              </div>

              <ApiDiffParameters parameters={data.parameters} method={method} />
              <ApiDiffRequestBody requests={data.requests} method={method} />
              <ApiDiffResponses responses={data.responses} method={method} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
