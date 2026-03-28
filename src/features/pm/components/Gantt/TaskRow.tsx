import React, { useRef, useEffect, useState } from 'react'
import { addDays, BASE_DATE, formatDate, TASK_COL_WIDTH } from '@/shared/utils/date'
import { Page } from '@/features/pm/types/gantt'
import PlannedBar from './PlannedBar'
import ActualBar from './ActualBar'
import ApiStatusModal from '../ApiStatusModal'

const DONE_STATUSES = ['완료', '완료됨', 'Done', 'Completed']

interface TaskRowProps {
  page: Page
  isEditing: boolean
  onChange: (page: Page) => void
  DAY_WIDTH: number
}

function getStatusStyle(status?: string) {
  if (!status) return null
  if (DONE_STATUSES.includes(status))
    return { label: 'Done', className: 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-100' }
  return { label: 'In Progress', className: 'bg-blue-50 text-blue-500 border-blue-100' }
}

function TaskRow({ page, isEditing, onChange, DAY_WIDTH }: TaskRowProps) {
  const pageRef = useRef(page)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    pageRef.current = page
  }, [page])

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if (!isEditing || page.date) return

    const trackElement = e.currentTarget as HTMLDivElement
    const trackRect = trackElement.getBoundingClientRect()

    const startX = e.clientX - trackRect.left
    const startDayOffset = Math.floor(startX / DAY_WIDTH)
    const startDate = addDays(BASE_DATE, startDayOffset)

    let currentStartStr = formatDate(startDate)
    let currentEndStr = formatDate(startDate)

    onChange({ ...pageRef.current, date: { start: currentStartStr, end: currentEndStr } })

    const onMove = (moveEvent: MouseEvent) => {
      const currentX = moveEvent.clientX - trackRect.left
      const currentDayOffset = Math.floor(currentX / DAY_WIDTH)
      const currentDate = addDays(BASE_DATE, currentDayOffset)

      const minDate = startDate < currentDate ? startDate : currentDate
      const maxDate = startDate > currentDate ? startDate : currentDate

      const newStartStr = formatDate(minDate)
      const newEndStr = formatDate(maxDate)

      if (currentStartStr !== newStartStr || currentEndStr !== newEndStr) {
        currentStartStr = newStartStr
        currentEndStr = newEndStr
        onChange({ ...pageRef.current, date: { start: currentStartStr, end: currentEndStr } })
      }
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleTitleClick = () => {
    if (isEditing) return
    setIsModalOpen(true)
  }

  const statusStyle = getStatusStyle(page.status)

  return (
    <>
      <div className='flex items-center h-20 relative hover:bg-gray-50/60 transition-colors border-b border-gray-50 last:border-b-0'>
        {/* Task title column */}
        <div
          className='text-base font-medium shrink-0 sticky left-0 bg-white z-40 flex flex-col pl-6 pr-4 justify-center border-r border-gray-100 h-full gap-1.5'
          style={{ width: TASK_COL_WIDTH }}
        >
          {isEditing ? (
            <input
              type='text'
              value={page.title}
              onChange={(e) => onChange({ ...page, title: e.target.value })}
              placeholder='Task name'
              className='w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-shadow'
            />
          ) : (
            <>
              <span
                onClick={handleTitleClick}
                className='truncate pr-2 cursor-pointer hover:text-pink-500 transition-colors text-sm font-semibold text-gray-800 leading-tight'
              >
                {page.title}
              </span>
              {statusStyle && (
                <span
                  className={`inline-flex w-fit items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle.className}`}
                >
                  <span className='w-1.5 h-1.5 rounded-full bg-current opacity-70' />
                  {statusStyle.label}
                </span>
              )}
            </>
          )}
        </div>

        {/* Bar track */}
        <div
          className={`relative flex-1 h-full flex items-center ${
            isEditing && !page.date ? 'cursor-crosshair' : ''
          }`}
          onMouseDown={handleTrackMouseDown}
        >
          {page.date && (
            <>
              {/* Actual bar: upper half (pink) */}
              <ActualBar
                page={page}
                isEditing={isEditing}
                onChange={onChange}
                DAY_WIDTH={DAY_WIDTH}
              />
              {/* Planned bar: lower half (gray) */}
              <PlannedBar
                page={page}
                isEditing={isEditing}
                onChange={onChange}
                DAY_WIDTH={DAY_WIDTH}
              />
            </>
          )}
        </div>
      </div>

      <ApiStatusModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pageId={page.id} />
    </>
  )
}

export default React.memo(TaskRow, (prevProps, nextProps) => {
  return (
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.DAY_WIDTH === nextProps.DAY_WIDTH &&
    prevProps.page === nextProps.page
  )
})
