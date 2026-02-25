import React, { useRef, useEffect } from 'react'
import { addDays, BASE_DATE, formatDate, TASK_COL_WIDTH } from '@/utils/date'
import { Page } from '@/types/gantt'
import PlannedBar from './PlannedBar'
import ActualBar from './ActualBar'

interface TaskRowProps {
  page: Page
  isEditing: boolean
  onChange: (page: Page) => void
  DAY_WIDTH: number
}

function TaskRow({ page, isEditing, onChange, DAY_WIDTH }: TaskRowProps) {
  const pageRef = useRef(page)

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

  return (
    <div className='flex items-center h-16 relative hover:bg-gray-50/50 transition-colors'>
      <div
        className='text-base font-medium shrink-0 sticky left-0 bg-white z-50 flex flex-col pl-6 pr-6 justify-center border-r border-gray-100 h-full'
        style={{ width: TASK_COL_WIDTH }}
      >
        {isEditing ? (
          <input
            type='text'
            value={page.title}
            onChange={(e) => onChange({ ...page, title: e.target.value })}
            placeholder='태스크 이름 입력'
            className='w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 transition-shadow'
          />
        ) : (
          <span className='truncate pr-2'>{page.title}</span>
        )}
      </div>

      <div
        className={`relative flex-1 h-full flex items-center ${
          isEditing && !page.date ? 'cursor-crosshair' : ''
        }`}
        onMouseDown={handleTrackMouseDown}
      >
        {page.status === '완료' && page.date && (
          <ActualBar date={page.date} DAY_WIDTH={DAY_WIDTH} />
        )}

        {page.status !== '완료' && page.date && (
          <PlannedBar page={page} isEditing={isEditing} onChange={onChange} DAY_WIDTH={DAY_WIDTH} />
        )}
      </div>
    </div>
  )
}

export default React.memo(TaskRow, (prevProps, nextProps) => {
  return (
    prevProps.isEditing === nextProps.isEditing &&
    prevProps.DAY_WIDTH === nextProps.DAY_WIDTH &&
    prevProps.page === nextProps.page
  )
})
