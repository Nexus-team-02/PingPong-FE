import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom' // useLocation 제거
import { SyncSwagger } from '@/api/swagger'
import useApi from '@/hook/useApi'
import { useApiDocs } from '@/hook/useApiDocs'
import ChangeSection from '@/components/api/ChangeSection'
import EndpointListView from '@/components/api/EndpointListView'
import BackendToolbar from '@/components/api/BackendToolbar'
import AuthorizeModal from '@/components/api/AuthorizeModal'
import Folder from '@/components/common/Folder'
import Spinner from '@/components/common/Spinner'

type ViewMode = 'LIST' | 'FLOW'

export default function BackendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('LIST')

  const { teamId } = useParams()
  const navigate = useNavigate()

  const { execute: syncSwagger, loading: syncLoading } = useApi(SyncSwagger)

  const {
    swaggerData,
    swaggerLoading,
    created,
    modified,
    deleted,
    hasChanges,
    flowData,
    flowLoading,
  } = useApiDocs(teamId)

  const isSyncing = swaggerLoading || syncLoading || flowLoading

  const handleSync = useCallback(() => {
    if (!teamId) return
    syncSwagger(Number(teamId))
  }, [teamId, syncSwagger])

  return (
    <div className='min-h-screen p-20 z-20'>
      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        {hasChanges && <ChangeSection created={created} modified={modified} deleted={deleted} />}

        <BackendToolbar
          viewMode={viewMode}
          isSyncing={isSyncing}
          onSync={handleSync}
          onAuthorize={() => setIsModalOpen(true)}
          onViewModeChange={setViewMode}
        />

        {viewMode === 'LIST' && <EndpointListView groups={swaggerData ?? []} />}

        {viewMode === 'FLOW' &&
          (flowLoading ? (
            <Spinner />
          ) : (
            <div className='flex flex-wrap gap-6 mt-6 ml-3'>
              {flowData?.map((flow) => (
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
          ))}
      </div>
      {isModalOpen && <AuthorizeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
