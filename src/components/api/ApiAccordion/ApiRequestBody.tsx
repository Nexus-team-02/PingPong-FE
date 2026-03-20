import { useEffect, Dispatch, SetStateAction } from 'react'
import { HttpMethod, ApiRequest, OpenApiSchema } from '@/types/api'
import Section from './Section'

// 💡 any 대신 OpenApiSchema와 unknown을 사용하여 타입 안정성 확보
const generateExampleFromSchema = (schema?: OpenApiSchema, keyName?: string): unknown => {
  if (!schema) return {}

  // Swagger에 이미 example 값이 정의되어 있다면 그것을 최우선으로 사용
  if (schema.example !== undefined) return schema.example

  // 1. 객체(Object) 타입 처리
  if (schema.type === 'object' || schema.properties) {
    const obj: Record<string, unknown> = {}
    if (schema.properties) {
      for (const key in schema.properties) {
        obj[key] = generateExampleFromSchema(schema.properties[key], key)
      }
    }
    return obj
  }

  // 2. 배열(Array) 타입 처리
  if (schema.type === 'array') {
    return schema.items ? [generateExampleFromSchema(schema.items)] : []
  }

  // 3. 원시 타입(Primitive Types) 스마트 처리
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
  // Try it out 활성화 시, 변환된 예시 JSON을 textarea 기본값으로 주입
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
          // 조회 모드(!isTryItOut)에서도 변환된 JSON을 보여주기 위해 렌더링 시점에 생성
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
