import ApiAccordionItem from '@/components/api/ApiAccordionItem'
import useApi from '@/hook/useApi'
import { SyncSwagger } from '@/api/swagger'
import { getFlow } from '@/api/flow'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import Title from '@/components/common/Title'
import Lock from '@/assets/lock.svg?react'
import AuthorizeModal from '@/components/api/AuthorizeModal'
import Folder from '@/components/common/Folder'

export default function BackendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'LIST' | 'FLOW'>('LIST')

  const { execute, loading, data } = useApi(SyncSwagger)
  const { execute: fetchFlows, data: flowData, loading: flowLoading } = useApi(getFlow)

  const { teamId } = useParams()
  const { pathname } = useLocation()
  const role = pathname.split('/')[3]

  const handleSync = useCallback(() => {
    if (!teamId) return
    execute(Number(teamId))
    fetchFlows(Number(teamId), role.toUpperCase())
  }, [teamId, execute, fetchFlows, role])

  useEffect(() => {
    handleSync()
  }, [handleSync])

  const endpoints = useMemo(() => {
    return (
      data?.flatMap((group) =>
        group.endpoints.map((endpoint) => ({
          ...endpoint,
          tag: group.tag,
          status: group.status,
        })),
      ) ?? []
    )
  }, [data])

  const { created, modified, deleted } = useMemo(() => {
    return endpoints.reduce(
      (acc, endpoint) => {
        if (endpoint.status !== 'CHANGED') return acc

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

  const isSyncing = loading || flowLoading

  return (
    <div className='min-h-screen p-20 z-20'>
      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        {hasChanges && (
          <div className='mb-12 p-6 rounded-lg bg-gray-50 border border-gray-200'>
            <h1 className='font-extrabold text-lg pb-6 flex items-center gap-2 text-blue-600'>
              <span className='relative flex h-3 w-3'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75'></span>
                <span className='relative inline-flex rounded-full h-3 w-3 bg-blue-500'></span>
              </span>
              NEW CHANGES
            </h1>

            {created.length > 0 && (
              <div className='mb-8'>
                <Title>
                  <span className='text-api-green'>ADD</span>
                </Title>
                <div className='flex flex-col gap-4 mt-4'>
                  {created.map((endpoint) => (
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
            )}

            {modified.length > 0 && (
              <div className='mb-8'>
                <Title>
                  <span className='text-api-yellow'>UPDATE</span>
                </Title>
                <div className='flex flex-col gap-4 mt-4'>
                  {modified.map((endpoint) => (
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
            )}

            {deleted.length > 0 && (
              <div className='mb-4'>
                <Title>
                  <span className='text-api-red'>DELETE</span>
                </Title>
                <div className='flex flex-col gap-4 mt-4'>
                  {deleted.map((endpoint) => (
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
            )}
          </div>
        )}

        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-xl font-bold'>{viewMode === 'LIST' ? 'ALL' : 'FLOW'}</h2>

          <div className='flex items-center gap-3'>
            <button
              onClick={handleSync}
              disabled={isSyncing}
              className='cursor-pointer flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
              title='Sync API Docs'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
                className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-500' : ''}`}
              >
                <path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' />
                <path d='M21 3v5h-5' />
              </svg>
              Sync
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className='cursor-pointer flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium text-black hover:bg-gray-100/50'
            >
              Authorise
              <Lock className='w-4.5 h-4.5' />
            </button>
            <div className='w-px h-5 bg-gray-300 mx-1'></div>
            <button
              onClick={() => setViewMode('LIST')}
              className={`cursor-pointer px-3 py-1 rounded-md border text-sm transition-colors ${
                viewMode === 'LIST'
                  ? 'bg-black text-white'
                  : 'border-gray-400 text-gray-700 hover:bg-gray-50'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('FLOW')}
              className={`cursor-pointer px-3 py-1 rounded-md border text-sm transition-colors ${
                viewMode === 'FLOW'
                  ? 'bg-black text-white'
                  : 'border-gray-400 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Flow
            </button>
          </div>
        </div>

        {viewMode === 'LIST' &&
          data?.map((group) => (
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

        {viewMode === 'FLOW' && (
          <div className='flex flex-wrap gap-6 mt-6 ml-3'>
            {flowLoading && <div className='text-gray-500'>Loading flows...</div>}
            {flowData?.map((flow) => (
              <Folder
                key={flow.flowId}
                imageUrl={flow.thumbnailUrl}
                folderName={flow.title}
                onClick={() => console.log('flow click', flow.flowId)}
              />
            ))}
          </div>
        )}
      </div>

      {isModalOpen && <AuthorizeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
