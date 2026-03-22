import { useNavigate } from 'react-router-dom'
import Folder from '@/components/common/Folder'
import Spinner from '@/components/common/Spinner'
import Lock from '@/assets/lock.svg?react'
import PlusIcon from '@/assets/plus.svg?react'

type Flow = {
  flowId: number
  title: string
  description?: string
  thumbnailUrl: string
}

type Props = {
  flows: Flow[]
  loading: boolean
  isFrontend: boolean
  onAuthorize: () => void
  onCreateFlow: () => void
}

export default function FlowSection({
  flows,
  loading,
  isFrontend,
  onAuthorize,
  onCreateFlow,
}: Props) {
  const navigate = useNavigate()

  return (
    <>
      <div className='flex items-center justify-between mb-8'>
        <h2 className='text-xl font-bold'>FLOW</h2>
        <div className='flex items-center gap-3'>
          <button
            onClick={onAuthorize}
            className='cursor-pointer flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium text-black hover:bg-gray-100/50'
          >
            Authorise
            <Lock className='w-4.5 h-4.5' />
          </button>
          <div className='w-px h-5 bg-gray-300 mx-1' />
          {isFrontend && <PlusIcon className='w-7 h-7 cursor-pointer' onClick={onCreateFlow} />}
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className='rounded-xl bg-white border border-gray-200 shadow-sm p-5'>
          <div className='flex flex-wrap gap-6 mb-5 mx-3'>
            {flows.map((flow) => (
              <Folder
                key={flow.flowId}
                imageUrl={flow.thumbnailUrl}
                folderName={flow.title}
                onClick={() =>
                  navigate(`integration/${flow.flowId}`, {
                    state: {
                      title: flow.title,
                      subtitle: flow.description || `${flow.title} API 연동 상세 페이지입니다.`,
                    },
                  })
                }
              />
            ))}
          </div>
        </div>
      )}
    </>
  )
}
