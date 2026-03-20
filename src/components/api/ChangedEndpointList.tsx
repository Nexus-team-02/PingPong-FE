import ApiAccordionItem from '@/components/api/ApiAccordion/ApiAccordionItem'
import { HttpMethod } from '@/types/api'

type Endpoint = {
  endpointId: number
  method: HttpMethod
  path: string
  summary: string
}

type ChangeType = 'CREATED' | 'MODIFIED' | 'DELETED'

const CHANGE_CONFIG: Record<
  ChangeType,
  {
    label: string
    colorClass: string
    borderColor: string
    bg: string
    wrapperClass?: string
  }
> = {
  CREATED: {
    label: 'ADD',
    colorClass: 'bg-api-green',
    borderColor: 'border-l-green-500',
    bg: 'bg-green-50/50',
  },
  MODIFIED: {
    label: 'UPDATE',
    colorClass: 'bg-api-yellow',
    borderColor: 'border-l-amber-500',
    bg: 'bg-amber-50/50',
  },
  DELETED: {
    label: 'DELETE',
    colorClass: 'bg-api-red',
    borderColor: 'border-l-red-400',
    bg: 'bg-red-50/50',
    wrapperClass: 'opacity-60',
  },
}

type Props = {
  endpoints: Endpoint[]
  changeType: ChangeType
}

export default function ChangedEndpointList({ endpoints, changeType }: Props) {
  if (endpoints.length === 0) return null

  const { label, colorClass, wrapperClass } = CHANGE_CONFIG[changeType]

  return (
    <div className='mb-8'>
      <div className={`inline-flex items-center px-3 py-1 rounded-full ${colorClass}`}>
        <span className='text-white text-xs font-bold tracking-wider'>{label}</span>
      </div>
      <div className={`flex flex-col gap-3 mt-4 ${wrapperClass ?? ''}`}>
        {endpoints.map((endpoint) => (
          <ApiAccordionItem
            key={endpoint.endpointId}
            method={endpoint.method}
            path={endpoint.path}
            summary={endpoint.summary}
            endpointId={endpoint.endpointId}
          />
        ))}
      </div>
    </div>
  )
}
