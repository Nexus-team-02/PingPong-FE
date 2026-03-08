import { HttpMethod } from '@/types/api'
import Section from './Section'

interface ApiExecutionResultProps {
  result: unknown
  method: HttpMethod
}

export default function ApiExecutionResult({ result, method }: ApiExecutionResultProps) {
  if (!result) return null

  return (
    <Section title='Execution Result (Live)' method={method}>
      <div className='space-y-2'>
        <div className='text-sm font-medium text-gray-700'>Response Body</div>
        <pre className='max-h-96 overflow-auto rounded-md bg-[#1e293b] p-4 text-xs leading-relaxed text-slate-50'>
          <code>{JSON.stringify(result, null, 2)}</code>
        </pre>
      </div>
    </Section>
  )
}
