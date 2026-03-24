import { useEffect, useMemo, useCallback } from 'react'
import { getLatestSwagger } from '@/features/backend/api/swagger'
import { getFlow } from '@/features/flow/api'
import useApi from '@/shared/hooks/useApi'
import { useTeamRoleStore } from '@/features/team/store'

export function useApiDocs(teamId: string | undefined) {
  const role = useTeamRoleStore((s) => s.role)

  const {
    execute: fetchLatestSwagger,
    data: swaggerData,
    loading: swaggerLoading,
  } = useApi(getLatestSwagger)
  const { execute: fetchFlows, data: flowData, loading: flowLoading } = useApi(getFlow)

  const handleInitialLoad = useCallback(() => {
    if (!teamId) return
    fetchLatestSwagger(Number(teamId))
    fetchFlows(Number(teamId), role.toUpperCase())
  }, [teamId, role, fetchLatestSwagger, fetchFlows])

  useEffect(() => {
    handleInitialLoad()
  }, [handleInitialLoad])

  const endpoints = useMemo(() => {
    return (
      swaggerData?.flatMap((group) =>
        group.endpoints.map((endpoint) => ({
          ...endpoint,
          tag: group.tag,
          status: group.status,
        })),
      ) ?? []
    )
  }, [swaggerData])

  const { created, modified, deleted } = useMemo(() => {
    const changedEndpoints = endpoints.filter((e) => e.status === 'CHANGED')

    return changedEndpoints.reduce(
      (acc, endpoint) => {
        if (endpoint.changeType === 'CREATED') acc.created.push(endpoint)
        if (endpoint.changeType === 'MODIFIED') acc.modified.push(endpoint)
        if (endpoint.changeType === 'DELETED') acc.deleted.push(endpoint)
        return acc
      },
      {
        created: [] as typeof endpoints,
        modified: [] as typeof endpoints,
        deleted: [] as typeof endpoints,
      },
    )
  }, [endpoints])

  const hasChanges = created.length > 0 || modified.length > 0 || deleted.length > 0

  return {
    swaggerData,
    swaggerLoading,
    endpoints,
    created,
    modified,
    deleted,
    hasChanges,
    flowData,
    flowLoading,
    refetch: handleInitialLoad,
  }
}
