import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useTeamRoleStore } from '@/features/team/store'
import { useApiDocs } from '@/features/backend/hooks/useApiDocs'
import ChangeSection from '@/features/backend/components/swagger/ChangeSection'
import FlowSection from '@/features/frontend/components/FlowSection'
import AuthorizeModal from '@/features/backend/components/swagger/AuthorizeModal'
import CreateFlowModal from '@/features/frontend/components/CreateFlowModal'
import TaskSection from '@/features/task/components/TaskSection'
import FloatingNav, { FloatingNavItem } from '@/shared/components/FloatingNav'

export default function FrontendApiDocsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFlowModalOpen, setIsFlowModalOpen] = useState(false)

  const { teamId } = useParams()
  const role = useTeamRoleStore((s) => s.role)
  const isFrontend = role === 'FRONTEND'

  const { created, modified, deleted, hasChanges, flowData, flowLoading } = useApiDocs(teamId)

  const changesRef = useRef<HTMLDivElement>(null)
  const flowRef = useRef<HTMLDivElement>(null)
  const taskRef = useRef<HTMLDivElement>(null)

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
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
      id: 'flows',
      label: 'Flows',
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
          <path d='M4 20h16a2 2 0 002-2V8a2 2 0 00-2-2h-7.93a2 2 0 01-1.66-.9l-1.38-2.07A2 2 0 007.38 2H4a2 2 0 00-2 2v14a2 2 0 002 2z' />
        </svg>
      ),
      onClick: () => scrollToSection(flowRef),
      labelBgClass: 'bg-purple-600',
      iconTextClass: 'text-purple-600',
    },
    {
      id: 'tasks',
      label: 'Tasks',
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
          <path d='M9 11l3 3L22 4' />
          <path d='M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11' />
        </svg>
      ),
      onClick: () => scrollToSection(taskRef),
      labelBgClass: 'bg-orange-500',
      iconTextClass: 'text-orange-500',
    },
  ]

  return (
    <div className='relative min-h-screen p-20 z-20'>
      <FloatingNav items={navItems} />

      <div className='w-full rounded-xl bg-white mx-auto p-8 mt-35 animate-fade-up'>
        {hasChanges && (
          <div ref={changesRef} className='scroll-mt-32'>
            <ChangeSection created={created} modified={modified} deleted={deleted} />
          </div>
        )}

        <div
          ref={flowRef}
          className={`scroll-mt-32 animate-card-in anim-delay-[0.1s] ${hasChanges ? 'mt-10' : ''}`}
        >
          <FlowSection
            flows={flowData ?? []}
            loading={flowLoading}
            isFrontend={isFrontend}
            onAuthorize={() => setIsModalOpen(true)}
            onCreateFlow={() => setIsFlowModalOpen(true)}
          />
        </div>

        <div ref={taskRef} className='scroll-mt-32 mt-10 animate-card-in anim-delay-[0.2s]'>
          <TaskSection availableFlows={flowData ?? []} />
        </div>

        {isModalOpen && <AuthorizeModal onClose={() => setIsModalOpen(false)} />}
        {isFlowModalOpen && (
          <CreateFlowModal onClose={() => setIsFlowModalOpen(false)} isOpen={isFlowModalOpen} />
        )}
      </div>
    </div>
  )
}
