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
type ChangesTab = 'github' | 'swagger'

export default function BackendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('LIST')
  const [syncTick, setSyncTick] = useState(false)
  const [changesTab, setChangesTab] = useState<ChangesTab>('github')
  const [githubHasChanges, setGithubHasChanges] = useState(false)

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
    refetch,
  } = useApiDocs(teamId)

  const isSyncing = swaggerLoading || syncLoading || flowLoading

  const handleSync = useCallback(async () => {
    if (!teamId) return
    try {
      await syncSwagger(Number(teamId))
      refetch?.()
      setSyncTick((v) => !v)
    } catch (error) {
      console.error('Swagger sync failed:', error)
    }
  }, [teamId, syncSwagger, refetch])

  const changesRef = useRef<HTMLDivElement>(null)
  const apiRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToTag = (tag: string) => {
    document.getElementById(`tag-${tag}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const totalChanges = created.length + modified.length + deleted.length

  const navItems: FloatingNavItem[] = [
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
          style={{ transform: 'rotate(90deg)' }}
        >
          <path d='m21 16-4 4-4-4' />
          <path d='M17 20V4' />
          <path d='m3 8 4-4 4 4' />
          <path d='M7 4v16' />
        </svg>
      ),
      onClick: () => scrollToSection(changesRef),
      labelBgClass: 'bg-gray-800',
      iconTextClass: 'text-blue-500',
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
      subItems: (swaggerData ?? []).map((group) => ({
        id: group.tag,
        label: group.tag,
      })),
      onSubItemClick: scrollToTag,
    },
  ]

  return (
    <div className='relative min-h-screen p-20 z-20'>
      <FloatingNav items={navItems} />

      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35 animate-fade-up'>
        <div ref={changesRef} className='scroll-mt-32 mb-10'>
          <div className='border border-gray-200 rounded-xl shadow-sm overflow-hidden'>
            <div className='flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50'>
              <div className='flex items-center gap-2.5'>
                <span className='relative flex h-2.5 w-2.5 shrink-0'>
                  <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75' />
                  <span className='relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500' />
                </span>
                <p className='text-sm font-semibold text-gray-800'>Changes</p>
                {hasChanges && (
                  <span className='text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full px-2 py-0.5'>
                    {totalChanges} endpoints
                  </span>
                )}
              </div>

              <div className='flex items-center gap-1 bg-gray-100 rounded-lg p-1'>
                <button
                  onClick={() => setChangesTab('github')}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    changesTab === 'github'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg className='w-3.5 h-3.5' viewBox='0 0 24 24' fill='currentColor'>
                    <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
                  </svg>
                  GitHub
                  {githubHasChanges && <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />}
                </button>
                <button
                  onClick={() => setChangesTab('swagger')}
                  className={`cursor-pointer flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                    changesTab === 'swagger'
                      ? 'bg-white text-gray-800 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='14'
                    height='14'
                    viewBox='0 0 24 24'
                    fill='none'
                    stroke={changesTab === 'swagger' ? '#16a34a' : 'currentColor'}
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  >
                    <path d='m21 16-4 4-4-4' />
                    <path d='M17 20V4' />
                    <path d='m3 8 4-4 4 4' />
                    <path d='M7 4v16' />
                  </svg>
                  Swagger
                  {hasChanges && <span className='w-1.5 h-1.5 rounded-full bg-blue-500' />}
                </button>
              </div>
            </div>

            <div className='p-6'>
              {changesTab === 'github' && (
                <GitHubSection refreshTrigger={syncTick} onChangeDetected={setGithubHasChanges} />
              )}
              {changesTab === 'swagger' &&
                (hasChanges ? (
                  <ChangeSection created={created} modified={modified} deleted={deleted} />
                ) : (
                  <div className='flex items-center gap-2 text-green-500 text-sm py-2'>
                    <span className='text-base'>✓</span>
                    변경된 엔드포인트가 없습니다
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div ref={apiRef} className='scroll-mt-32'>
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
