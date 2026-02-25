import { useState } from 'react'
import { useParams } from 'react-router-dom'
import Title from '@/components/common/Title'
import NotionIcon from '@/assets/notion.svg?react'
import useApi from '@/hook/useApi'
import { getDatabase, selectDatabase } from '@/api/notion'

interface NotionSectionProps {
  connected: boolean
  databaseSelected: boolean
  onUpdated: () => void
}

interface NotionDatabase {
  id: string
  title: string
}

export default function NotionSection({
  connected,
  databaseSelected,
  onUpdated,
}: NotionSectionProps) {
  const { teamId } = useParams<{ teamId: string }>()
  const numericTeamId = Number(teamId)

  const { execute: fetchDatabases } = useApi(getDatabase)
  const { execute: updatePrimary } = useApi(selectDatabase)

  const [databases, setDatabases] = useState<NotionDatabase[]>([])
  const [loadingDb, setLoadingDb] = useState(false)
  const [selectingDbId, setSelectingDbId] = useState<string | null>(null)

  const handleConnect = () => {
    const redirectUri = encodeURIComponent('https://pingpong-team.vercel.app/notion/callback')

    const state = encodeURIComponent(JSON.stringify({ teamId }))

    const notionAuthUrl =
      `https://api.notion.com/v1/oauth/authorize` +
      `?client_id=2f5d872b-594c-80cc-a32b-003748ffcba9` +
      `&response_type=code` +
      `&owner=user` +
      `&redirect_uri=${redirectUri}` +
      `&state=${state}`

    window.location.href = notionAuthUrl
  }

  const handleLoadDatabase = async () => {
    setLoadingDb(true)
    try {
      const res = await fetchDatabases(numericTeamId)
      setDatabases(res)
    } finally {
      setLoadingDb(false)
    }
  }

  const handleSelectDatabase = async (databaseId: string) => {
    setSelectingDbId(databaseId)
    try {
      await updatePrimary(numericTeamId, databaseId)
      onUpdated()
    } finally {
      setSelectingDbId(null)
    }
  }

  return (
    <section className='rounded-xl border border-black/10 bg-white/60 px-6 py-8 shadow-sm'>
      <Title size='md'>NOTION</Title>

      {!connected && (
        <div className='mt-6 flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4'>
          <div className='flex items-center gap-4'>
            <NotionIcon className='h-8 w-8' />
            <div>
              <p className='font-medium text-gray-900'>Connect Notion Workspace</p>
              <p className='text-sm text-gray-500'>Sync your team's workspace to get started.</p>
            </div>
          </div>
          <button
            onClick={handleConnect}
            className='rounded-md bg-black px-5 py-2 text-sm font-medium text-white hover:bg-gray-800'
          >
            Connect
          </button>
        </div>
      )}

      {connected && !databaseSelected && (
        <div className='mt-6'>
          <div className='rounded-lg border border-gray-200 bg-gray-50/50 p-5'>
            <div className='mb-4 flex items-center justify-between'>
              <h3 className='text-sm font-medium text-gray-900'>Select a Database</h3>

              {databases.length === 0 && (
                <button
                  onClick={handleLoadDatabase}
                  disabled={loadingDb}
                  className='cursor-pointer rounded-md border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50'
                >
                  {loadingDb ? 'Loading...' : 'Load Databases'}
                </button>
              )}
            </div>

            {databases.length > 0 && (
              <div className='space-y-3'>
                {databases.map((db) => (
                  <div
                    key={db.id}
                    className='group flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-black hover:shadow-sm'
                  >
                    <div className='flex items-center gap-3'>
                      <svg
                        className='h-5 w-5 text-gray-400 group-hover:text-black'
                        fill='none'
                        viewBox='0 0 24 24'
                        stroke='currentColor'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4'
                        />
                      </svg>
                      <span className='font-medium text-gray-900'>{db.title}</span>
                    </div>
                    <button
                      onClick={() => handleSelectDatabase(db.id)}
                      disabled={selectingDbId === db.id}
                      className='cursor-pointer rounded-md bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-black hover:text-white disabled:opacity-50'
                    >
                      {selectingDbId === db.id ? 'Selecting...' : 'Select'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
