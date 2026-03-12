import { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import { CommentData, LinkedEndpoint } from '@/types/flow'
import { createRequestComment } from '@/api/flow'
import useApi from '@/hook/useApi'
import { useTeamRoleStore } from '@/stores/teamRoleStore'

const METHOD_COLORS: Record<string, string> = {
  GET: 'bg-api-blue',
  POST: 'bg-api-green',
  PUT: 'bg-api-yellow',
  DELETE: 'bg-api-red',
  PATCH: 'bg-[#8BE0C4]',
}

const METHOD_HEX_COLORS: Record<string, string> = {
  GET: '#61affe',
  POST: '#49cc90',
  PUT: '#fca130',
  DELETE: '#f93e3e',
  PATCH: '#8BE0C4',
}

type DraftComment = { id: number; imageId: number; x: number; y: number; isDraft: true }

interface CommentPinProps {
  comment: CommentData | DraftComment
  index: number | string
  onSave?: (text: string, newId?: number) => void
  onCancel?: () => void
  isReadonly?: boolean
  onOpenApiModal?: (requestId: number) => void
}

function PinBadge({ endpoints, index }: { endpoints?: LinkedEndpoint[]; index: number | string }) {
  const primary = endpoints?.[0]

  if (primary) {
    const shortPath = '/' + primary.path.split('/').filter(Boolean).slice(-2).join('/')
    const color = METHOD_COLORS[primary.method.toUpperCase()] ?? 'bg-gray-500'
    const tipColor = METHOD_HEX_COLORS[primary.method.toUpperCase()] ?? '#6b7280'

    return (
      <div className='flex flex-col items-center cursor-pointer hover:opacity-90 transition'>
        <div
          className={`flex items-center gap-1 ${color} text-white rounded-lg pl-1.5 pr-2.5 py-1 text-[10px] font-bold shadow-md whitespace-nowrap`}
        >
          <span className='bg-white/20 rounded-full px-1'>{primary.method}</span>
          <span className='font-mono'>{shortPath}</span>
          {endpoints!.length > 1 && (
            <span className='bg-white/30 rounded-full px-1'>+{endpoints!.length - 1}</span>
          )}
        </div>
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            borderTop: `7px solid ${tipColor}`,
          }}
        />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center cursor-pointer transition'>
      <div className='px-2 h-6 bg-red-500 text-white rounded-md flex items-center justify-center text-xs font-bold shadow-md hover:bg-red-600 transition'>
        {index}
      </div>
      <div
        style={{
          width: 0,
          height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: '6px solid #ef4444',
        }}
      />
    </div>
  )
}

export default function CommentPin({
  comment,
  index,
  onSave,
  onCancel,
  isReadonly,
  onOpenApiModal,
}: CommentPinProps) {
  const [text, setText] = useState('text' in comment ? comment.text : '')
  const [isOpen, setIsOpen] = useState('isDraft' in comment)
  const pinRef = useRef<HTMLDivElement>(null)
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 })
  const inputRef = useRef<HTMLInputElement>(null)
  const role = useTeamRoleStore((s) => s.role)
  const { execute, loading } = useApi(createRequestComment)

  useEffect(() => {
    if (!isOpen || !pinRef.current) return
    const rect = pinRef.current.getBoundingClientRect()
    setPopupPos({
      top: rect.bottom + window.scrollY + 8,
      left: rect.left + window.scrollX + rect.width / 2,
    })
  }, [isOpen])

  useEffect(() => {
    if (isOpen && !isReadonly && inputRef.current) inputRef.current.focus()
  }, [isOpen, isReadonly])

  const handleSave = async () => {
    if (!text.trim()) return
    if ('isDraft' in comment) {
      try {
        const result = await execute(comment.imageId, { x: comment.x, y: comment.y, content: text })
        onSave?.(text, result?.id ?? result)
        setIsOpen(false)
      } catch {
        // handleApiError에서 이미 toast.error() 처리됨
      }
    } else {
      onSave?.(text, comment.id)
      setIsOpen(false)
    }
  }

  const endpoints = !('isDraft' in comment) ? (comment as CommentData).endpoints : undefined

  const popup = isOpen
    ? ReactDOM.createPortal(
        <div
          className='absolute z-40 bg-white rounded-lg shadow-xl p-3 w-60 cursor-default -translate-x-1/2'
          style={{ top: popupPos.top, left: popupPos.left }}
          onClick={(e) => e.stopPropagation()}
        >
          {'isDraft' in comment ? (
            <div className='flex flex-col gap-2'>
              <input
                ref={inputRef}
                type='text'
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder='댓글을 입력하세요...'
                className='w-full border-b border-gray-300 outline-none text-sm p-1'
                onKeyDown={(e) => e.key === 'Enter' && !loading && handleSave()}
                disabled={loading}
              />
              <div className='flex justify-end gap-2 mt-1'>
                <button
                  onClick={onCancel}
                  className='text-xs text-gray-500 hover:text-gray-800'
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className='text-xs text-blue-600 hover:text-blue-800 font-semibold disabled:text-gray-400'
                >
                  {loading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>
          ) : (
            <div className='flex flex-col gap-3'>
              <p className='text-sm text-gray-800 wrap-break-word whitespace-pre-wrap'>{text}</p>
              {endpoints && endpoints.length > 0 && (
                <div className='flex flex-col gap-1.5'>
                  {endpoints.map((ep) => {
                    const epColor = METHOD_COLORS[ep.method.toUpperCase()] ?? 'bg-gray-500'
                    return (
                      <div
                        key={ep.endpointId}
                        className={`flex flex-col text-[11px] font-mono text-white ${epColor} px-2 py-1 rounded shadow-sm`}
                      >
                        <span className='font-bold bg-white/20 w-max px-1 rounded-sm mb-0.5'>
                          {ep.method}
                        </span>
                        <span className='break-all opacity-95'>{ep.path}</span>
                      </div>
                    )
                  })}
                </div>
              )}
              {role === 'BACKEND' && onOpenApiModal && (
                <button
                  onClick={() => {
                    onOpenApiModal((comment as CommentData).id)
                    setIsOpen(false)
                  }}
                  className='w-full py-1.5 mt-1 bg-white text-gray-700 border border-gray-300 rounded text-xs font-bold hover:bg-gray-50 transition shadow-sm'
                >
                  API 연동하기
                </button>
              )}
            </div>
          )}
        </div>,
        document.body,
      )
    : null

  return (
    <div
      ref={pinRef}
      className='absolute z-50'
      style={{ left: `${comment.x}%`, top: `${comment.y}%`, transform: 'translate(-50%, -100%)' }}
      onClick={(e) => {
        e.stopPropagation()
        if (isReadonly) setIsOpen((p) => !p)
      }}
    >
      <PinBadge endpoints={endpoints} index={index} />
      {popup}
    </div>
  )
}
