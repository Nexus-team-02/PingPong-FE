import { useState } from 'react'
import Modal from '@/shared/components/Modal'
import { addTaskFlows } from '@/features/task/api'

interface Flow {
  flowId: number
  title: string
  thumbnailUrl?: string
}

interface TaskFlowModalProps {
  taskId: string
  taskTitle: string
  availableFlows: Flow[]
  connectedFlowIds: number[]
  onClose: () => void
  onSaved: (taskId: string, newFlowIds: number[]) => void
}

export default function TaskFlowModal({
  taskId,
  taskTitle,
  availableFlows,
  connectedFlowIds,
  onClose,
  onSaved,
}: TaskFlowModalProps) {
  const [selected, setSelected] = useState<Set<number>>(new Set(connectedFlowIds))
  const [isSaving, setIsSaving] = useState(false)

  const toggle = (flowId: number) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(flowId)) {
        next.delete(flowId)
      } else {
        next.add(flowId)
      }
      return next
    })
  }

  const handleSave = async () => {
    const newFlowIds = [...selected].filter((id) => !connectedFlowIds.includes(id))
    if (newFlowIds.length === 0) {
      onClose()
      return
    }
    try {
      setIsSaving(true)
      await addTaskFlows(taskId, newFlowIds)
      onSaved(taskId, [...selected])
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal title={`Flow 연결 : ${taskTitle}`} onClose={onClose} size='md'>
      <div className='flex flex-col gap-2 max-h-72 overflow-y-auto mb-5'>
        {availableFlows.length === 0 ? (
          <p className='text-sm text-gray-400 text-center py-6'>연결할 수 있는 Flow가 없습니다.</p>
        ) : (
          availableFlows.map((flow) => {
            const isChecked = selected.has(flow.flowId)
            return (
              <label
                key={flow.flowId}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all ${
                  isChecked
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <input
                  type='checkbox'
                  className='w-4 h-4 accent-blue-500 cursor-pointer'
                  checked={isChecked}
                  onChange={() => toggle(flow.flowId)}
                />
                {flow.thumbnailUrl && (
                  <img
                    src={flow.thumbnailUrl}
                    alt={flow.title}
                    className='w-8 h-8 rounded object-cover shrink-0'
                  />
                )}
                <span className='text-sm text-gray-800 font-medium'>{flow.title}</span>
              </label>
            )
          })
        )}
      </div>

      <div className='flex justify-end gap-2'>
        <button
          onClick={onClose}
          className='px-4 py-2 rounded-lg text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition-all'
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className='px-4 py-2 rounded-lg text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        >
          {isSaving ? '저장 중…' : '저장'}
        </button>
      </div>
    </Modal>
  )
}
