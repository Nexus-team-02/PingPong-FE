import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { getGithubSyncResult, getGithubConfig } from '@/api/github'
import useApi from '@/hook/useApi'
import BranchConfigModal from '@/components/api/BranchConfigModal'

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

const STATUS_STYLE: Record<string, string> = {
  modified: 'text-yellow-500 border-yellow-500',
  added: 'text-green-500 border-green-500',
  removed: 'text-red-500 border-red-500',
}

function DiffFileCard({ file }: { file: DiffFile }) {
  const [expanded, setExpanded] = useState(true)
  const statusStyle = STATUS_STYLE[file.status] ?? 'text-gray-500 border-gray-400'

  return (
    <div className='border border-gray-200 rounded-lg overflow-hidden bg-white'>
      <button
        className='w-full flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors text-left'
        onClick={() => setExpanded((v) => !v)}
      >
        <div className='flex items-center gap-2 min-w-0 flex-1'>
          <span className='text-gray-400 text-xs shrink-0'>{expanded ? '▾' : '▸'}</span>
          <a
            href={file.githubFileUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-600 text-sm font-semibold hover:underline truncate'
            onClick={(e) => e.stopPropagation()}
          >
            {file.fileName}
          </a>
          <span
            className={`shrink-0 text-xs font-medium border rounded px-1.5 py-0.5 capitalize ${statusStyle}`}
          >
            {file.status}
          </span>
        </div>
        <div className='flex gap-3 shrink-0 ml-3 text-xs font-semibold'>
          <span className='text-green-500'>+{file.additions}</span>
          <span className='text-red-400'>−{file.deletions}</span>
        </div>
      </button>

      {expanded && (
        <div className='max-h-80 overflow-y-auto border-t border-gray-200'>
          {file.changesPreview.map((line, i) => (
            <div
              key={i}
              className={`flex items-start gap-2.5 px-4 py-0.5 text-xs leading-5 font-mono ${
                line.type === 'add'
                  ? 'bg-green-500/10'
                  : line.type === 'delete'
                    ? 'bg-red-500/10'
                    : ''
              }`}
            >
              <span className='shrink-0 w-3 font-bold select-none text-gray-400'>
                {line.type === 'add' ? '+' : line.type === 'delete' ? '−' : ' '}
              </span>
              <span className='flex-1 text-gray-800 whitespace-pre overflow-hidden'>
                {line.content}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GitHubSection() {
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
  }, [refresh])

  const config = configRaw as {
    repoOwner: string
    repoName: string
    branch: string
    lastSyncedAt: string
  } | null

  const sync = syncRaw as { changed: boolean; data: SyncResultData | string } | null
  const isLoading = configLoading || syncLoading
  const apiError = syncError as ApiErrorResponse | null

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
      <div className='bg-white border border-gray-200 rounded-xl p-5 mb-6 font-mono shadow-sm'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-3'>
            <svg className='w-5 h-5 text-gray-800 shrink-0' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z' />
            </svg>
            <div>
              <p className='text-blue-600 font-bold text-sm tracking-tight'>
                {config ? `${config.repoOwner}/${config.repoName}` : '—'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className='flex items-center gap-1.5 text-gray-400 text-xs mt-0.5 hover:text-blue-500 transition-colors group'
              >
                <span className='inline-block w-2 h-2 rounded-full bg-green-400 group-hover:bg-blue-400 transition-colors' />
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
                <p className='text-red-400/70 text-xs mt-0.5'>{apiError?.response?.data?.code}</p>
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
            <div className='flex items-start gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 mb-3'>
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

            <div className='flex items-center gap-4 text-sm mb-3'>
              <span className='text-gray-500'>
                📄 <strong className='text-gray-800'>{diffData.summary.filesChanged}</strong> files
              </span>
              <span className='text-green-500 font-medium'>+{diffData.summary.additions}</span>
              <span className='text-red-400 font-medium'>−{diffData.summary.deletions}</span>
            </div>

            <div className='flex flex-col gap-2'>
              {diffData.files.map((file) => (
                <DiffFileCard key={file.fileName} file={file} />
              ))}
            </div>
          </>
        )}
      </div>

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
