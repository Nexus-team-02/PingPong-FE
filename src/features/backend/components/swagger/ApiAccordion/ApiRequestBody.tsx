import { useEffect, Dispatch, SetStateAction } from 'react'
import { HttpMethod, ApiRequest, OpenApiSchema } from '@/features/backend/types/swagger'
import Section from './Section'

const generateExampleFromSchema = (schema?: OpenApiSchema, keyName?: string): unknown => {
  if (!schema) return {}

  if (schema.example !== undefined) return schema.example

  if (schema.type === 'object' || schema.properties) {
    const obj: Record<string, unknown> = {}
    if (schema.properties) {
      for (const key in schema.properties) {
        obj[key] = generateExampleFromSchema(schema.properties[key], key)
      }
    }
    return obj
  }

  if (schema.type === 'array') {
    return schema.items ? [generateExampleFromSchema(schema.items)] : []
  }

  if (schema.type === 'string') {
    const lowerKey = keyName?.toLowerCase() || ''
    if (lowerKey.includes('email')) return 'example@gmail.com'
    if (lowerKey.includes('password')) return 'password123'
    if (lowerKey.includes('id')) return 'id_string'
    if (lowerKey.includes('url')) return 'https://example.com'
    return 'string'
  }

  if (schema.type === 'integer' || schema.type === 'number') return 0
  if (schema.type === 'boolean') return true

  return null
}

interface ApiRequestBodyProps {
  requests: ApiRequest[]
  method: HttpMethod
  isTryItOut: boolean
  bodyInput: string
  setBodyInput: Dispatch<SetStateAction<string>>
}

export default function ApiRequestBody({
  requests,
  method,
  isTryItOut,
  bodyInput,
  setBodyInput,
}: ApiRequestBodyProps) {
  useEffect(() => {
    if (isTryItOut && requests?.length > 0) {
      setBodyInput((prevBody) => {
        if (!prevBody && requests[0].schema) {
          const exampleObj = generateExampleFromSchema(requests[0].schema)
          return JSON.stringify(exampleObj, null, 2)
        }
        return prevBody
      })
    }
  }, [isTryItOut, requests, setBodyInput])

  if (!requests || requests.length === 0) return null

  return (
    <Section title='Request Body' method={method}>
      <div className='space-y-4'>
        {requests.map((r, i) => {
          const displayExample = generateExampleFromSchema(r.schema)

          return (
            <div key={i} className='space-y-2'>
              <div className='text-sm font-medium text-gray-700'>
                {r.mediaType}
                {r.required && <span className='ml-2 text-xs text-red-500'>* required</span>}
              </div>

              {isTryItOut ? (
                <textarea
                  value={bodyInput}
                  onChange={(e) => setBodyInput(e.target.value)}
                  className='w-full rounded border border-gray-300 p-2 text-sm font-mono focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
                  rows={10}
                />
              ) : (
                <pre className='max-h-64 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
                  <code>{JSON.stringify(displayExample, null, 2)}</code>
                </pre>
              )}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
