import { useEffect, useState } from 'react'
import { useLocation, useOutletContext, useParams } from 'react-router-dom'
import { useTeamRoleStore } from '@/stores/teamRoleStore'
import { useFlowComments } from '@/hook/useFlowComments'
import { isFlowPageState } from '@/types/flow'
import LeftIcon from '@/assets/left.svg?react'
import RightIcon from '@/assets/right.svg?react'
import EditIcon from '@/assets/edit.svg?react'
import CommentCanvas from '@/components/Flow/CommentCanvas'
import LinkedApiAccordionItem from '@/components/api/LinkedApiAccordionItem'
import ApiLinkModal from '@/components/Flow/ApiLinkModal'
import Spinner from '@/components/common/Spinner'

interface TeamLayoutContext {
  setDynamicTitle: (title: string | null) => void
  setDynamicSubtitle: (subtitle: string | null) => void
}

export default function ApiIntegrationPage() {
  const location = useLocation()
  const { flowId } = useParams()
  const { setDynamicTitle, setDynamicSubtitle } = useOutletContext<TeamLayoutContext>()
  const role = useTeamRoleStore((s) => s.role)

  const {
    flowLoading,
    commentsLoading,
    currentImage,
    allComments,
    groupedApiData,
    goToPrev,
    goToNext,
    addDraftComment,
    refetchComments,
  } = useFlowComments(flowId)

  const [editMode, setEditMode] = useState(false)
  const [modalState, setModalState] = useState<{ open: boolean; requestId: number | null }>({
    open: false,
    requestId: null,
  })

  useEffect(() => {
    if (isFlowPageState(location.state)) {
      if (location.state.title) setDynamicTitle(location.state.title)
      if (location.state.subtitle) setDynamicSubtitle(location.state.subtitle)
    }
    return () => {
      setDynamicTitle(null)
      setDynamicSubtitle(null)
    }
  }, [location.state, setDynamicSubtitle, setDynamicTitle])

  if (flowLoading) return <Spinner />

  return (
    <div className='min-h-screen p-10 pt-50 z-20 flex flex-col items-center'>
      {role === 'FRONTEND' && (
        <EditIcon
          onClick={() => setEditMode((prev) => !prev)}
          className={`w-6 h-6 ml-170 transition cursor-pointer ${
            editMode ? 'text-red-500 hover:text-red-600' : 'text-gray-700 hover:text-blue-700'
          }`}
        />
      )}

      <div className='w-full max-w-5xl flex items-center justify-between mb-16 mt-10'>
        <LeftIcon
          onClick={goToPrev}
          className='cursor-pointer w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition'
        />

        <div className='relative w-180 h-105'>
          <CommentCanvas
            currentImage={currentImage}
            editMode={editMode && role === 'FRONTEND'}
            comments={allComments}
            onAddComment={addDraftComment}
            onOpenApiModal={(requestId) => setModalState({ open: true, requestId })}
          />
        </div>

        <RightIcon
          onClick={goToNext}
          className='cursor-pointer w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition'
        />
      </div>

      <div className='w-full max-w-5xl mt-10'>
        {commentsLoading ? (
          <Spinner />
        ) : groupedApiData.length > 0 ? (
          groupedApiData.map((group) => (
            <div key={group.tag} className='mt-8 mb-8'>
              <h2 className='text-xl font-bold mb-4'>{group.tag}</h2>
              <div className='flex flex-col gap-4'>
                {group.endpoints.map((ep) => (
                  <LinkedApiAccordionItem
                    key={ep.endpointId}
                    method={ep.method}
                    path={ep.path}
                    summary={ep.summary}
                    endpointId={ep.endpointId}
                    flowImageId={currentImage?.imageId}
                    isLinked={ep.isLinked}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className='text-center text-gray-500'>이 이미지에 연결된 API가 없습니다.</div>
        )}
      </div>

      <ApiLinkModal
        isOpen={modalState.open}
        onClose={() => setModalState({ open: false, requestId: null })}
        requestId={modalState.requestId}
        onSuccess={refetchComments}
      />
    </div>
  )
}
