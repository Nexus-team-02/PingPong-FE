import { useState } from 'react'
import CommentPin from './CommentPin'
import { CommentData, FlowImage } from '@/features/flow/types'

interface CommentCanvasProps {
  currentImage?: FlowImage
  editMode: boolean
  comments: CommentData[]
  onAddComment: (comment: Omit<CommentData, 'id'>) => void
  onOpenApiModal: (requestId: number) => void
}

export default function CommentCanvas({
  currentImage,
  editMode,
  comments,
  onAddComment,
  onOpenApiModal,
}: CommentCanvasProps) {
  const [draftPoint, setDraftPoint] = useState<{ x: number; y: number } | null>(null)

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!editMode || !currentImage) return
    if (draftPoint) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setDraftPoint({ x, y })
  }

  const handleSaveDraft = (text: string) => {
    if (!draftPoint || !currentImage) return
    onAddComment({
      imageId: currentImage.imageId,
      x: draftPoint.x,
      y: draftPoint.y,
      text,
    })
    setDraftPoint(null)
  }

  if (!currentImage) {
    return (
      <div className='w-full h-full flex items-center justify-center text-gray-400 bg-white rounded-2xl shadow-lg'>
        이미지가 없습니다.
      </div>
    )
  }
  const currentComments = comments.filter((c) => c.imageId === currentImage.imageId)

  return (
    <div className='relative z-20 w-full h-full bg-white rounded-2xl shadow-lg overflow-hidden'>
      {editMode && (
        <div className={`fixed inset-0 bg-black/10 z-10 pointer-events-none transition-opacity`} />
      )}

      <div
        onClick={handleImageClick}
        className={`relative w-full h-full z-20 ${editMode ? 'cursor-crosshair' : ''}`}
      >
        <img
          src={currentImage.imageUrl}
          alt={`Slide ID: ${currentImage.imageId}`}
          className='w-full h-full object-cover select-none'
          draggable={false}
        />

        {currentComments.map((comment, index) => (
          <CommentPin
            key={comment.id}
            comment={comment}
            index={index + 1}
            isReadonly={!editMode}
            onOpenApiModal={onOpenApiModal}
          />
        ))}

        {draftPoint && editMode && (
          <CommentPin
            comment={{
              id: -1,
              x: draftPoint.x,
              y: draftPoint.y,
              isDraft: true,
              imageId: currentImage.imageId,
            }}
            index='+'
            onSave={handleSaveDraft}
            onCancel={() => setDraftPoint(null)}
          />
        )}
      </div>
    </div>
  )
}
