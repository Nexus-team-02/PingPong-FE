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

function getSuggestions(isReady: boolean): string[] {
  if (isReady) {
    return [
      '현재 진행 중인 작업 중 지연된 항목이 있나요?',
      '이번 주 마감 예정인 태스크를 요약해줘',
      '완료율이 가장 낮은 작업은 무엇인가요?',
    ]
  }
  return [
    'Notion 연동은 어떻게 시작하나요?',
    '데이터베이스를 연결하면 어떤 기능을 쓸 수 있나요?',
    '프로젝트 관리 페이지 사용법을 알려줘',
  ]
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
      <div className='animate-fade-up'>
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
      </div>

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
          <AIChatWidget
            isOpen={isChatOpen}
            onClose={handleCloseChat}
            suggestions={getSuggestions(isReady)}
          />
        </div>
      )}
    </div>
  )
}
