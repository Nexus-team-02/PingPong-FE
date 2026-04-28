import ChangedEndpointList from './ChangedEndpointList'
import { HttpMethod } from '@/features/backend/types/swagger'

type Endpoint = {
  endpointId: number
  method: HttpMethod
  path: string
  summary: string
}

type Props = {
  created: Endpoint[]
  modified: Endpoint[]
  deleted: Endpoint[]
}

export default function ChangeSection({ created, modified, deleted }: Props) {
  return (
    <div>
      <div className='flex items-center gap-4 text-sm mb-6'>
        <span className='text-gray-500'>
          <strong className='text-gray-800'>
            {created.length + modified.length + deleted.length}
          </strong>{' '}
          endpoints
        </span>
        <span className='text-green-500 font-medium'>+{created.length}</span>
        <span className='text-amber-400 font-medium'>~{modified.length}</span>
        <span className='text-red-400 font-medium'>−{deleted.length}</span>
      </div>

      <ChangedEndpointList endpoints={created} changeType='CREATED' />
      <ChangedEndpointList endpoints={modified} changeType='MODIFIED' />
      <ChangedEndpointList endpoints={deleted} changeType='DELETED' />
    </div>
  )
}
