import ApiAccordionItem from '@/components/api/ApiAccordion/ApiAccordionItem'
import Title from '@/components/common/Title'
import { HttpMethod } from '@/types/api'

type Endpoint = {
  endpointId: number
  method: HttpMethod
  path: string
  summary: string
}

type Group = {
  tag: string
  endpoints: Endpoint[]
}

type Props = {
  groups: Group[]
}

export default function EndpointListView({ groups }: Props) {
  return (
    <>
      {groups.map((group) => (
        <div key={group.tag} className='mt-8 mb-8'>
          <Title>{group.tag}</Title>
          <div className='flex flex-col gap-4 mt-4'>
            {group.endpoints.map((endpoint) => (
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
      ))}
    </>
  )
}
