import PlusIcon from '@/assets/plus.svg?react'

interface ConnectedFlow {
  flowId: number
  title: string
}

interface Task {
  taskId: string
  title: string
  dateStart: string
  dateEnd: string
  flowMappingCompleted: boolean
  flows: ConnectedFlow[]
}

interface TaskCardProps {
  task: Task
  onToggleComplete: (taskId: string, current: boolean) => void
  onOpenFlowModal: (taskId: string) => void
}

export default function TaskCard({ task, onToggleComplete, onOpenFlowModal }: TaskCardProps) {
  const { taskId, title, dateStart, dateEnd, flowMappingCompleted, flows } = task

  return (
    <div className='rounded-xl border border-gray-200 bg-gray-50 p-4 transition-shadow hover:shadow-sm'>
      <div className='flex items-start justify-between mb-3'>
        <div>
          <p className='text-sm font-semibold text-gray-900'>{title}</p>
          <p className='text-xs text-gray-500 mt-0.5'>
            {dateStart} ~ {dateEnd}
          </p>
        </div>

        <button
          onClick={() => onToggleComplete(taskId, flowMappingCompleted)}
          title={flowMappingCompleted ? '연결 완료 상태' : '완료로 표시'}
          className={`mt-0.5 w-5 h-5 rounded-full border-2 shrink-0 transition-all cursor-pointer flex items-center justify-center ${
            flowMappingCompleted
              ? 'bg-blue-500 border-blue-500'
              : 'bg-white border-gray-400 hover:border-gray-600'
          }`}
        >
          {flowMappingCompleted && (
            <svg className='w-3 h-3 text-white' viewBox='0 0 12 12' fill='none'>
              <path
                d='M2 6l3 3 5-5'
                stroke='currentColor'
                strokeWidth='1.8'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          )}
        </button>
      </div>

      <div className='flex flex-col gap-2'>
        {flows.map((flow) => (
          <div
            key={flow.flowId}
            className='rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700'
          >
            {flow.title}
          </div>
        ))}

        <button
          onClick={() => onOpenFlowModal(taskId)}
          className='flex items-center gap-1.5 rounded-md border border-dashed border-gray-300 px-3 py-2 text-xs text-gray-400 hover:border-gray-400 hover:text-gray-600 hover:bg-white/60 transition-all cursor-pointer'
        >
          <PlusIcon className='w-3.5 h-3.5' />
          Flow 연결
        </button>
      </div>
    </div>
  )
}

export type { Task, ConnectedFlow }
