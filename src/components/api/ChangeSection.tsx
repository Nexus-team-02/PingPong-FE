import ChangedEndpointList from './ChangedEndpointList'
import { HttpMethod } from '@/types/api'

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

const SUMMARY_CONFIG = [
  {
    label: 'Added',
    count: (p: Props) => p.created.length,
    bg: 'bg-green-50',
    text: 'text-green-800',
    num: 'text-green-900',
  },
  {
    label: 'Modified',
    count: (p: Props) => p.modified.length,
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    num: 'text-amber-900',
  },
  {
    label: 'Deleted',
    count: (p: Props) => p.deleted.length,
    bg: 'bg-red-50',
    text: 'text-red-800',
    num: 'text-red-900',
  },
]

export default function ChangeSection({ created, modified, deleted }: Props) {
  const props = { created, modified, deleted }

  return (
    <div className='mb-12 p-6 rounded-xl bg-white border border-gray-200 shadow-sm'>
      <h1 className='font-extrabold text-lg pb-6 flex items-center gap-2 text-blue-600'>
        <span className='relative flex h-3 w-3'>
          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
          <span className='relative inline-flex rounded-full h-3 w-3 bg-blue-500' />
        </span>
        NEW CHANGES
      </h1>

      <div className='grid grid-cols-3 gap-3 mb-8'>
        {SUMMARY_CONFIG.map(({ label, count, bg, text, num }) => (
          <div key={label} className={`${bg} rounded-lg px-4 py-3`}>
            <p className={`text-xs font-medium uppercase tracking-wide ${text} mb-1`}>{label}</p>
            <p className={`text-2xl font-medium ${num}`}>{count(props)}</p>
          </div>
        ))}
      </div>

      <ChangedEndpointList endpoints={created} changeType='CREATED' />
      <ChangedEndpointList endpoints={modified} changeType='MODIFIED' />
      <ChangedEndpointList endpoints={deleted} changeType='DELETED' />
    </div>
  )
}
