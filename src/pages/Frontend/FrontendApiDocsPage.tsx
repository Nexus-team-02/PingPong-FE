import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { useTeamRoleStore } from '@/stores/teamRoleStore'
import { useApiDocs } from '@/hook/useApiDocs'
import ChangeSection from '@/components/api/ChangeSection'
import FlowSection from '@/components/api/FlowSection'
import AuthorizeModal from '@/components/api/AuthorizeModal'
import CreateFlowModal from '@/components/api/CreateFlowModal'
import TaskSection from '@/components/Task/TaskSection'

export default function FrontendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false)

  const { teamId } = useParams()
  const role = useTeamRoleStore((s) => s.role)
  const isFrontend = role === 'FRONTEND'

  const { created, modified, deleted, hasChanges, flowData, flowLoading } = useApiDocs(teamId)

  return (
    <div className='min-h-screen p-20 z-20'>
      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35'>
        {hasChanges && <ChangeSection created={created} modified={modified} deleted={deleted} />}

        <FlowSection
          flows={flowData ?? []}
          loading={flowLoading}
          isFrontend={isFrontend}
          onAuthorize={() => setIsModalOpen(true)}
          onCreateFlow={() => setIsFlowModalOpen(true)}
        />

        <TaskSection availableFlows={flowData ?? []} />

        {isModalOpen && <AuthorizeModal onClose={() => setIsModalOpen(false)} />}
        {isFlowModalOpen && (
          <CreateFlowModal onClose={() => setIsFlowModalOpen(false)} isOpen={isFlowModalOpen} />
        )}
      </div>
    </div>
  )
}
