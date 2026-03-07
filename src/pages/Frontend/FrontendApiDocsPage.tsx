import { useEffect, useMemo, useState } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import ApiAccordionItem from '@/components/api/ApiAccordionItem'
import useApi from '@/hook/useApi'
import { getAllEndpoints } from '@/api/swagger'
import Title from '@/components/common/Title'
import AuthorizeModal from '@/components/api/AuthorizeModal'
import CreateFlowModal from '@/components/api/CreateFlowModal'
import PlusIcon from '@/assets/plus.svg?react'
import Folder from '@/components/common/Folder'
import { getFlow } from '@/api/flow'

export default function FrontendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false)

  const { execute, loading, data } = useApi(getAllEndpoints)
  const { execute: fetchFlows, data: flowData, loading: flowLoading } = useApi(getFlow)

  const { teamId } = useParams()

  const { pathname } = useLocation()
  const role = pathname.split('/')[3]

  useEffect(() => {
    if (!teamId) return

    execute(Number(teamId))
    fetchFlows(Number(teamId), role.toUpperCase())
  }, [teamId, execute, fetchFlows, role])

  const { created, modified, deleted } = useMemo(() => {
    const result = {
      created: [] as typeof data,
      modified: [] as typeof data,
      deleted: [] as typeof data,
    }

    data?.forEach((endpoint) => {
      if (endpoint.changeType === 'CREATED') result.created?.push(endpoint)
      if (endpoint.changeType === 'MODIFIED') result.modified?.push(endpoint)
      if (endpoint.changeType === 'DELETED') result.deleted?.push(endpoint)
    })

    return result
  }, [data])

  return (
    <div className='min-h-screen p-20 z-20'>
      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        <h1 className='font-extrabold text-lg pb-10'>NEW CHANGES</h1>
        {loading && <div className='mb-4'>Loading...</div>}

        <Title>ADD</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {created?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>

        <Title>UPDATE</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {modified?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>

        <Title>DELETE</Title>
        <div className='flex flex-col gap-4 mb-8'>
          {deleted?.map((endpoint) => (
            <ApiAccordionItem
              key={endpoint.endpointId}
              method={endpoint.method}
              path={endpoint.path}
              summary={endpoint.summary}
              endpointId={endpoint.endpointId}
            />
          ))}
        </div>
        <Title
          size='lg'
          right={
            <PlusIcon className='w-7 h-7 cursor-pointer' onClick={() => setIsFlowModalOpen(true)} />
          }
        >
          Flow
        </Title>
        {flowLoading && <div>Loading flows...</div>}

        <div className='flex flex-wrap gap-6 mt-6 ml-3'>
          {flowData?.map((flow) => (
            <Folder
              key={flow.flowId}
              imageUrl={flow.thumbnailUrl}
              folderName={flow.title}
              onClick={() => console.log('flow click', flow.flowId)}
            />
          ))}
        </div>
        {isModalOpen && (
          <AuthorizeModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={(token) => {
              localStorage.setItem('accessToken', token)
            }}
          />
        )}
        {isFlowModalOpen && (
          <CreateFlowModal onClose={() => setIsFlowModalOpen(false)} isOpen={isFlowModalOpen} />
        )}
      </div>
    </div>
  )
}
