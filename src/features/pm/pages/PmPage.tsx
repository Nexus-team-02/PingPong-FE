import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import NotionSection from '@/features/pm/components/NotionSection'
import GanttChart from '@/features/pm/components/Gantt/GanttChart'
import AIChatWidget from '@/features/pm/components/AIChatWidget'
import ChatButton from '@/features/pm/components/ChatButton'
import { getNotionStatus } from '@/features/pm/api'
import useApi from '@/shared/hooks/useApi'
import Spinner from '@/shared/components/Spinner'

interface NotionStatus {
  connected: boolean
  workspaceId: string | null
  workspaceName: string | null
  databaseId: string | null
  databaseSelected: boolean
}

export default function PmPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isChatMounted, setIsChatMounted] = useState(false)
  const [isChatVisible, setIsChatVisible] = useState(false)

  const { teamId } = useParams()
  const { execute } = useApi(getNotionStatus)

  const [notionStatus, setNotionStatus] = useState<NotionStatus>({
    connected: false,
    workspaceId: null,
    workspaceName: null,
    databaseId: null,
    databaseSelected: false,
  })
  const [loading, setLoading] = useState(true)

  const isReady = notionStatus.connected && notionStatus.databaseSelected

  const fetchStatus = useCallback(async () => {
    if (!teamId) return
    setLoading(true)
    try {
      const result = await execute(Number(teamId))
      setNotionStatus(result)
    } catch (error) {
      console.error('Failed to load Notion status.', error)
    } finally {
      setLoading(false)
    }
  }, [teamId, execute])

  useEffect(() => {
    fetchStatus()
  }, [fetchStatus])

  const handleOpenChat = () => {
    setIsChatOpen(true)
    setIsChatMounted(true)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsChatVisible(true))
    })
  }

  const handleCloseChat = () => {
    setIsChatVisible(false)
    setTimeout(() => {
      setIsChatMounted(false)
      setIsChatOpen(false)
    }, 300)
  }

  const handleUpdated = fetchStatus

  if (loading) return <Spinner />

  return (
    <div className='pt-30 px-16'>
      {isReady ? (
        <div className='mt-15'>
          <GanttChart />
        </div>
      ) : (
        <div className='mt-30 mx-10'>
          <NotionSection
            connected={notionStatus.connected}
            databaseSelected={notionStatus.databaseSelected}
            onUpdated={handleUpdated}
          />
        </div>
      )}

      <ChatButton onClick={handleOpenChat} />

      {isChatMounted && (
        <div
          className='fixed bottom-0 right-0 z-50 transition-all duration-300 ease-out'
          style={{
            opacity: isChatVisible ? 1 : 0,
            transform: isChatVisible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
            transformOrigin: 'bottom right',
          }}
        >
          <AIChatWidget isOpen={isChatOpen} onClose={handleCloseChat} />
        </div>
      )}
    </div>
  )
}
