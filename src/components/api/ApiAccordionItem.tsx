import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Open from '@/assets/up.svg?react'
import Spinner from '../common/Spinner'
import { getDetailsEndpoint, executeEndpoint } from '@/api/swagger'
import useApi from '@/hook/useApi'
import { useApiAuthStore } from '@/stores/apiAuthStore'
import { HttpMethod, ExecutionResult } from '@/types/api'
import { METHOD_STYLE } from '@/constants/method'

import ApiParameters from './ApiParameters'
import ApiRequestBody from './ApiRequestBody'
import ApiExecutionResult from './ApiExecutionResult'
import ApiResponses from './ApiResponses'
import ApiSecurity from './ApiSecurity'

interface Props {
  method: HttpMethod
  path: string
  summary?: string
  endpointId: number
}

export default function ApiAccordionItem({ method, path, summary, endpointId }: Props) {
  const { execute, data, loading } = useApi(getDetailsEndpoint)
  const { execute: executeApi, loading: executeLoading } = useApi(executeEndpoint)

  const { teamId } = useParams()
  const token = useApiAuthStore((s) => s.token)

  const [open, setOpen] = useState(false)
  const [isTryItOut, setIsTryItOut] = useState(false)
  const [paramsInput, setParamsInput] = useState<Record<string, string>>({})
  const [bodyInput, setBodyInput] = useState('')

  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null)

  const handleTryItOutChange = (val: boolean) => {
    setIsTryItOut(val)
    if (!val) {
      setExecutionResult(null)
    }
  }

  const handleToggle = async () => {
    const next = !open
    setOpen(next)

    if (next && !data) {
      await execute(endpointId)
    }

    if (!next) {
      setIsTryItOut(false)
      setExecutionResult(null)
    }
  }

  const handleParamChange = (name: string, value: string) => {
    setParamsInput((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleExecute = async () => {
    if (!teamId || !data) return

    try {
      setExecutionResult(null)

      const pathVariables: Record<string, string> = {}
      const queryParams: Record<string, string> = {}

      data.parameters?.forEach((p) => {
        const value = paramsInput[p.name]
        if (!value) return

        if (p.in === 'path') {
          pathVariables[p.name] = value
        }

        if (p.in === 'query') {
          queryParams[p.name] = value
        }
      })

      const result = await executeApi(endpointId, Number(teamId), {
        pathVariables,
        queryParams,
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: bodyInput,
      })

      setExecutionResult(result)
    } catch (e) {
      console.error(e)
      const message = e instanceof Error ? e.message : '요청 중 오류가 발생했습니다.'
      setExecutionResult({
        error: true,
        message,
        details: e,
      })
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
              <ApiParameters
                parameters={data.parameters}
                method={method}
                isTryItOut={isTryItOut}
                setIsTryItOut={handleTryItOutChange}
                paramsInput={paramsInput}
                handleParamChange={handleParamChange}
                handleExecute={handleExecute}
                executeLoading={executeLoading}
              />

              <ApiRequestBody
                requests={data.requests}
                method={method}
                isTryItOut={isTryItOut}
                bodyInput={bodyInput}
                setBodyInput={setBodyInput}
              />

              <ApiExecutionResult result={executionResult} method={method} />

              <ApiResponses responses={data.responses} method={method} />

              <ApiSecurity security={data.security} method={method} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
