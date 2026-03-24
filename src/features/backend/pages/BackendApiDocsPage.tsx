import { useState, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { SyncSwagger } from '@/features/backend/api/swagger'
import useApi from '@/shared/hooks/useApi'
import { useApiDocs } from '@/features/backend/hooks/useApiDocs'
import ChangeSection from '@/features/backend/components/swagger/ChangeSection'
import EndpointListView from '@/features/backend/components/swagger/EndpointListView'
import BackendToolbar from '@/features/backend/components/BackendToolbar'
import AuthorizeModal from '@/features/backend/components/swagger/AuthorizeModal'
import GitHubSection from '@/features/backend/components/github/GithubSection'
import Folder from '@/shared/components/Folder'
import Spinner from '@/shared/components/Spinner'
import FloatingNav, { FloatingNavItem } from '@/shared/components/FloatingNav'

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

  // Ref 설정
  const githubRef = useRef<HTMLDivElement>(null)
  const changesRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const navItems: FloatingNavItem[] = [
    {
      id: 'github',
      label: 'GitHub',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.5 5 1.9 5 1.9a5.5 5.5 0 0 0-.1 3.8A5.5 5.5 0 0 0 3 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4' />
        </svg>
      ),
      onClick: () => scrollToSection(githubRef),
      labelBgClass: 'bg-gray-800',
      iconTextClass: 'text-gray-700',
    },
    {
      id: 'changes',
      label: 'Changes',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <path d='m21 16-4 4-4-4' />
          <path d='M17 20V4' />
          <path d='m3 8 4-4 4 4' />
          <path d='M7 4v16' />
        </svg>
      ),
      onClick: () => scrollToSection(changesRef),
      isVisible: hasChanges,
      labelBgClass: 'bg-blue-600',
      iconTextClass: 'text-blue-600',
    },
    {
      id: 'api-docs',
      label: 'API Docs',
      icon: (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='20'
          height='20'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          strokeLinecap='round'
          strokeLinejoin='round'
        >
          <rect width='16' height='16' x='4' y='4' rx='2' />
          <path d='M9 9h6' />
          <path d='M9 13h6' />
          <path d='M9 17h3' />
        </svg>
      ),
      onClick: () => scrollToSection(apiRef),
      labelBgClass: 'bg-green-600',
      iconTextClass: 'text-green-600',
    },
  ]

  return (
    <div className='relative min-h-screen p-20 z-20'>
      <FloatingNav items={navItems} />

      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        <div ref={githubRef} className='scroll-mt-32'>
          <GitHubSection />
        </div>

        {hasChanges && (
          <div ref={changesRef} className='scroll-mt-32 mt-10'>
            <ChangeSection created={created} modified={modified} deleted={deleted} />
          </div>
        )}

        <div ref={apiRef} className='scroll-mt-32 mt-10'>
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
      </div>

      {isModalOpen && <AuthorizeModal onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
