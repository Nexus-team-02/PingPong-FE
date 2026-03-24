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
    <div className='mb-8 p-6 rounded-xl bg-white border border-gray-200 shadow-sm'>
      <div className='flex items-center gap-2.5 pb-5'>
        <span className='relative flex h-2.5 w-2.5 shrink-0'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
          <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500' />
        </span>
        <div>
          <p className='text-base font-semibold text-gray-800'>New changes</p>
        </div>
      </div>

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
