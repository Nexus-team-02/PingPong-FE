import ApiDiffAccordionItem from './ApiDiffAccordion/ApiDiffAccordionItem'
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
    wrapperClass?: string
  }
> = {
  CREATED: {
    label: 'ADD',
    colorClass: 'bg-api-green',
  },
  MODIFIED: {
    label: 'UPDATE',
    colorClass: 'bg-api-yellow',
  },
  DELETED: {
    label: 'DELETE',
    colorClass: 'bg-api-red',
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
          <ApiDiffAccordionItem
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
