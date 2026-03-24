import { client } from '@/shared/api/client'
import { handleApiError } from '@/shared/api/handleApiError'
import { TaskFlowResponse, TaskResponse } from '@/features/task/types'

export async function getTasks(teamId: number) {
  try {
    const res = await client.get(`/api/v1/tasks/teams/${teamId}`)
    return res.data.result.map((task: TaskResponse) => ({
      ...task,
      taskId: task.id,
      flows: task.flows.map((f: TaskFlowResponse) => ({
        ...f,
        flowId: f.id,
      })),
    }))
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function addTaskFlows(taskId: string, flowIds: number[]) {
  try {
    const res = await client.post(`/api/v1/tasks/${taskId}/flows`, { flowIds })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}

export async function updateTaskFlowMappingCompleted(
  taskId: string,
  flowMappingCompleted: boolean,
) {
  try {
    const res = await client.patch(`/api/v1/tasks/${taskId}/mapped`, { flowMappingCompleted })
    console.log(res)
    return res.data.result
  } catch (error) {
    throw handleApiError(error)
  }
}
