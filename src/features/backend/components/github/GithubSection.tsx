import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getGithubSyncResult, getGithubConfig } from '@/features/backend/api/github'
import useApi from '@/shared/hooks/useApi'
import BranchConfigModal from '@/features/backend/components/github/BranchConfigModal'

interface DiffLine {
  type: 'add' | 'delete' | 'unchanged'
  content: string
}

interface DiffFile {
  fileName: string
  githubFileUrl: string
  status: 'modified' | 'added' | 'removed' | string
  additions: number
  deletions: number
  changes: number
  changesPreview: DiffLine[]
}

interface LatestCommit {
  message: string
  authorEmail: string
  authorProfileImage: string
  authoredAt: string
}

interface SyncResultData {
  compare: {
    githubCompareUrl: string
    latestCommit: LatestCommit
  }
  summary: {
    filesChanged: number
    additions: number
    deletions: number
    changes: number
  }
  files: DiffFile[]
}

interface ApiErrorResponse {
  response?: {
    data?: {
      message?: string
      code?: string
    }
  }
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return `${diff}초 전`
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`
  return `${Math.floor(diff / 86400)}일 전`
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string }> = {
  modified: { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-600', dot: 'bg-amber-400' },
  added: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-600',
    dot: 'bg-emerald-400',
  },
  removed: { bg: 'bg-red-50 border-red-200', text: 'text-red-500', dot: 'bg-red-400' },
}

function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width='14'
      height='14'
      viewBox='0 0 14 14'
      fill='none'
      className='shrink-0 text-gray-400 transition-transform duration-200'
      style={{ transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}
    >
      <path
        d='M5 3L9 7L5 11'
        stroke='currentColor'
        strokeWidth='1.6'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}

function DiffFileCard({ file }: { file: DiffFile }) {
  const [expanded, setExpanded] = useState(false)
  const statusCfg = STATUS_CONFIG[file.status] ?? {
    bg: 'bg-gray-50 border-gray-200',
    text: 'text-gray-500',
    dot: 'bg-gray-400',
  }

  const parts = file.fileName.split('/')
  const shortName = parts[parts.length - 1]
  const dirPath = parts.slice(0, -1).join('/') + (parts.length > 1 ? '/' : '')

  return (
    <div className='rounded-lg overflow-hidden border border-gray-200'>
      <button
        className='cursor-pointer w-full flex items-center gap-2.5 px-4 py-2.5 bg-gray-50/50 hover:bg-gray-100 transition-colors text-left'
        onClick={() => setExpanded((v) => !v)}
      >
        <ChevronIcon expanded={expanded} />
        <svg
          width='13'
          height='14'
          viewBox='0 0 13 14'
          fill='none'
          className='shrink-0 text-gray-500'
        >
          <path
            d='M2 1H8.5L11 3.5V13H2V1Z'
            stroke='currentColor'
            strokeWidth='1.2'
            strokeLinejoin='round'
          />
          <path d='M8 1V4H11' stroke='currentColor' strokeWidth='1.2' strokeLinejoin='round' />
        </svg>
        <span className='flex-1 min-w-0 flex items-baseline gap-0.5 text-sm'>
          {dirPath && (
            <span className='text-gray-500 text-xs truncate shrink-0 max-w-[40%]'>{dirPath}</span>
          )}
          <a
            href={file.githubFileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='cursor-pointer text-gray-800 font-medium hover:text-blue-600 transition-colors truncate'
            onClick={(e) => e.stopPropagation()}
          >
            {shortName}
          </a>
        </span>
        <span
          className={`shrink-0 flex items-center gap-1.5 text-[11px] font-medium px-2 py-0.5 rounded-full border ${statusCfg.bg} ${statusCfg.text}`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
          {file.status}
        </span>
        <div className='flex gap-2.5 shrink-0 text-xs font-mono font-semibold'>
          <span className='text-emerald-600'>+{file.additions}</span>
          <span className='text-red-500'>−{file.deletions}</span>
        </div>
      </button>

      {expanded && (
        <div className='max-h-80 overflow-y-auto bg-[#0d1117] border-t border-gray-200'>
          <table className='w-full border-collapse text-xs font-mono leading-5'>
            <tbody>
              {file.changesPreview.map((line, i) => (
                <tr
                  key={i}
                  className={
                    line.type === 'add'
                      ? 'bg-emerald-500/10 hover:bg-emerald-500/15'
                      : line.type === 'delete'
                        ? 'bg-red-500/10 hover:bg-red-500/15'
                        : 'hover:bg-white/5'
                  }
                >
                  <td className='w-8 text-center select-none border-r border-white/5 py-0.5 px-2 shrink-0'>
                    {line.type === 'add' ? (
                      <span className='text-emerald-400 font-bold'>+</span>
                    ) : line.type === 'delete' ? (
                      <span className='text-red-400 font-bold'>−</span>
                    ) : (
                      <span className='text-slate-700'> </span>
                    )}
                  </td>
                  <td className='py-0.5 px-3 whitespace-pre overflow-hidden'>
                    <span
                      className={
                        line.type === 'add'
                          ? 'text-emerald-300'
                          : line.type === 'delete'
                            ? 'text-red-300'
                            : 'text-slate-400'
                      }
                    >
                      {line.content}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default function GitHubSection({
  refreshTrigger,
  onChangeDetected,
}: {
  refreshTrigger?: boolean
  onChangeDetected?: (hasChange: boolean) => void
}) {
  const { teamId } = useParams()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: configRaw, loading: configLoading, execute: fetchConfig } = useApi(getGithubConfig)
  const {
    data: syncRaw,
    loading: syncLoading,
    error: syncError,
    execute: fetchSync,
  } = useApi(getGithubSyncResult)

  const refresh = useCallback(() => {
    if (!teamId) return
    fetchConfig(Number(teamId))
    fetchSync(Number(teamId))
  }, [teamId, fetchConfig, fetchSync])

  useEffect(() => {
    refresh()
  }, [refresh, refreshTrigger])

  const config = configRaw as {
    repoOwner: string
    repoName: string
    branch: string
    lastSyncedAt: string
  } | null

  const sync = syncRaw as { changed: boolean; data: SyncResultData | string } | null
  const isLoading = configLoading || syncLoading
  const apiError = syncError as ApiErrorResponse | null

  useEffect(() => {
    if (sync !== null) {
      onChangeDetected?.(!!sync.changed)
    }
  }, [sync, onChangeDetected])

  const diffData: SyncResultData | null = sync?.data
    ? typeof sync.data === 'string'
      ? (() => {
          try {
            return JSON.parse(sync.data)
          } catch {
            return null
          }
        })()
      : sync.data
    : null

  const currentRepoUrl = config ? `https://github.com/${config.repoOwner}/${config.repoName}` : ''

  return (
    <>
      <div className='flex items-center justify-between mb-5'>
        <div className='flex items-center gap-2.5'>
          <svg className='w-4 h-4 text-gray-800 shrink-0' viewBox='0 0 24 24' fill='currentColor'>
            <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
          </svg>
          <div>
            <p className='text-sm font-semibold text-gray-800'>
              {config ? `${config.repoOwner}/${config.repoName}` : '—'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className='flex items-center gap-1 text-xs text-gray-400 mt-0.5 hover:text-blue-500 transition-colors group'
            >
              <span className='inline-block w-1.5 h-1.5 rounded-full bg-green-400 group-hover:bg-blue-400 transition-colors' />
              {config?.branch ?? '—'}
              <span className='text-gray-300 group-hover:text-blue-400 transition-colors'>✎</span>
            </button>
          </div>
        </div>

        {config?.lastSyncedAt && (
          <p className='text-gray-400 text-xs'>마지막 동기화 {timeAgo(config.lastSyncedAt)}</p>
        )}
      </div>

      {isLoading && (
        <div className='flex gap-1.5 py-3'>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className='w-1.5 h-1.5 rounded-full bg-blue-400 opacity-40 animate-bounce'
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      )}

      {!isLoading && apiError && (
        <div className='flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-sm'>
          <span className='text-red-400 text-base shrink-0'>⚠</span>
          <div>
            <p className='text-red-400 font-medium'>
              {apiError?.response?.data?.message ?? 'GitHub 동기화 결과를 불러오지 못했습니다.'}
            </p>
            {apiError?.response?.data?.code && (
              <p className='text-red-400/70 text-xs mt-0.5'>{apiError.response.data.code}</p>
            )}
          </div>
        </div>
      )}

      {!isLoading && !apiError && !sync?.changed && (
        <div className='flex items-center gap-2 text-green-500 text-sm py-2'>
          <span className='text-base'>✓</span>
          변경된 내용이 없습니다
        </div>
      )}

      {!isLoading && !apiError && diffData && sync?.changed && (
        <>
          {diffData.compare && (
            <div className='flex items-start gap-3 bg-gray-50/50 border border-gray-200 rounded-lg px-4 py-3 mb-3'>
              <img
                src={diffData.compare.latestCommit.authorProfileImage}
                alt='author'
                className='w-9 h-9 rounded-full shrink-0 border-2 border-gray-200'
              />
              <div className='flex-1 min-w-0'>
                <p className='text-gray-800 text-sm font-semibold truncate'>
                  {diffData.compare.latestCommit.message}
                </p>
                <p className='text-gray-400 text-xs mt-0.5'>
                  {diffData.compare.latestCommit.authorEmail} ·{' '}
                  {timeAgo(diffData.compare.latestCommit.authoredAt)}
                </p>
              </div>
              <a
                href={diffData.compare.githubCompareUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='shrink-0 text-xs text-blue-600 border border-gray-200 rounded-md px-2.5 py-1 bg-white hover:bg-gray-50 transition-colors whitespace-nowrap'
              >
                Compare ↗
              </a>
            </div>
          )}

          {diffData.summary && (
            <div className='flex items-center gap-4 text-sm mb-3'>
              <span className='text-gray-500'>
                <strong className='text-gray-800'>{diffData.summary.filesChanged}</strong> files
              </span>
              <span className='text-emerald-600 font-medium'>+{diffData.summary.additions}</span>
              <span className='text-red-500 font-medium'>−{diffData.summary.deletions}</span>
            </div>
          )}

          {diffData.files && (
            <div className='flex flex-col gap-2'>
              {diffData.files.map((file) => (
                <DiffFileCard key={file.fileName} file={file} />
              ))}
            </div>
          )}
        </>
      )}

      {isModalOpen && config && (
        <BranchConfigModal
          initialUrl={currentRepoUrl}
          initialBranch={config.branch}
          teamId={Number(teamId)}
          onClose={() => setIsModalOpen(false)}
          onSaved={refresh}
        />
      )}
    </>
  )
}
