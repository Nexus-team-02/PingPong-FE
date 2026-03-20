import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getTasks, updateTaskFlowMappingCompleted } from '@/api/task'
import TaskCard, { type Task } from './TaskCard'
import TaskFlowModal from './TaskFlowModal'
import Spinner from '@/components/common/Spinner'

interface Flow {
  flowId: number
  title: string
  thumbnailUrl?: string
}

interface TaskSectionProps {
  availableFlows: Flow[]
}

interface ModalState {
  taskId: string
  taskTitle: string
  connectedFlowIds: number[]
}

export default function TaskSection({ availableFlows }: TaskSectionProps) {
  const { teamId } = useParams()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<ModalState | null>(null)

  const fetchTasks = useCallback(async () => {
    if (!teamId) return
    try {
      setLoading(true)
      const result = await getTasks(Number(teamId))
      setTasks(result ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [teamId])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleToggleComplete = useCallback(async (taskId: string, current: boolean) => {
    try {
      await updateTaskFlowMappingCompleted(taskId, !current)
      setTasks((prev) =>
        prev.map((t) => (t.taskId === taskId ? { ...t, flowMappingCompleted: !current } : t)),
      )
    } catch (err) {
      console.error(err)
    }
  }, [])

  const handleOpenFlowModal = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.taskId === taskId)
      if (!task) return
      setModal({
        taskId,
        taskTitle: task.title,
        connectedFlowIds: task.flows.map((f) => f.flowId),
      })
    },
    [tasks],
  )

  const handleFlowSaved = useCallback(
    (taskId: string, newFlowIds: number[]) => {
      setTasks((prev) =>
        prev.map((t) => {
          if (t.taskId !== taskId) return t
          const updatedFlows = newFlowIds.map((id) => {
            const existing = t.flows.find((f) => f.flowId === id)
            if (existing) return existing
            const flow = availableFlows.find((f) => f.flowId === id)
            return { flowId: id, title: flow?.title ?? `Flow ${id}` }
          })
          return { ...t, flows: updatedFlows }
        }),
      )
    },
    [availableFlows],
  )

  const inProgress = tasks.filter((t) => !t.flowMappingCompleted)
  const completed = tasks.filter((t) => t.flowMappingCompleted)

  return (
    <>
      <div className='mt-20'>
        <h2 className='text-xl font-bold mb-10'>TASK</h2>

        {loading ? (
          <Spinner />
        ) : (
          <div className='grid grid-cols-2 gap-4'>
            <div className='rounded-xl border border-gray-200 bg-white p-5'>
              <p className='text-sm font-semibold text-gray-700 mb-4'>Flow 연결 중</p>
              {inProgress.length === 0 ? (
                <p className='text-xs text-gray-400 text-center py-8'>진행 중인 Task가 없습니다.</p>
              ) : (
                <div className='flex flex-col gap-3'>
                  {inProgress.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onOpenFlowModal={handleOpenFlowModal}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className='rounded-xl border border-gray-200 bg-white p-5'>
              <p className='text-sm font-semibold text-gray-700 mb-4'>Flow 연결 완료</p>
              {completed.length === 0 ? (
                <p className='text-xs text-gray-400 text-center py-8'>완료된 Task가 없습니다.</p>
              ) : (
                <div className='flex flex-col gap-3'>
                  {completed.map((task) => (
                    <TaskCard
                      key={task.taskId}
                      task={task}
                      onToggleComplete={handleToggleComplete}
                      onOpenFlowModal={handleOpenFlowModal}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {modal && (
        <TaskFlowModal
          taskId={modal.taskId}
          taskTitle={modal.taskTitle}
          availableFlows={availableFlows}
          connectedFlowIds={modal.connectedFlowIds}
          onClose={() => setModal(null)}
          onSaved={handleFlowSaved}
        />
      )}
    </>
  )
}
