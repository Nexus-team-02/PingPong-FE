import { getDayOffset, addDays, formatDate, getToday } from '@/shared/utils/date'
import { Page } from '@/features/pm/types/gantt'
import { useGanttScroll } from '@/features/pm/hooks/useGanttScroll'

const DONE_STATUSES = ['완료', '완료됨', 'Done', 'Completed']

interface ActualBarProps {
  page: Page
  isEditing: boolean
  onChange: (page: Page) => void
  DAY_WIDTH: number
}

export default function ActualBar({ page, isEditing, onChange, DAY_WIDTH }: ActualBarProps) {
  const scrollRef = useGanttScroll()
  const { date, completedDate, status } = page

  if (!date) return null
  if (!completedDate) return null

  const today = getToday()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  const isDone = status ? DONE_STATUSES.includes(status) : false

  const actualStart = completedDate.start
  const actualEnd = isDone ? (completedDate.end ?? todayStr) : todayStr

  const startOffset = getDayOffset(actualStart)
  const endOffset = getDayOffset(actualEnd)
  const duration = endOffset - startOffset

  if (duration <= 0) return null

  const canEdit = isEditing && !!page.id

  const handleDrag = (e: React.MouseEvent) => {
    if (!canEdit) return
    e.stopPropagation()

    const startX = e.clientX
    const originalStart = new Date(actualStart)
    const originalEnd = new Date(actualEnd)

    const onMove = (moveEvent: MouseEvent) => {
      const dayChange = Math.round((moveEvent.clientX - startX) / DAY_WIDTH)
      const newStart = addDays(originalStart, dayChange)
      const newEnd = addDays(originalEnd, dayChange)

      onChange({
        ...page,
        completedDate: {
          start: formatDate(newStart),
          end: isDone ? formatDate(newEnd) : null,
        },
      })
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResizeLeft = (e: React.MouseEvent) => {
    if (!canEdit) return
    e.stopPropagation()

    const startX = e.clientX
    const originalStart = new Date(actualStart)

    const onMove = (moveEvent: MouseEvent) => {
      const dayChange = Math.round((moveEvent.clientX - startX) / DAY_WIDTH)
      const newStart = addDays(originalStart, dayChange)
      const endDate = new Date(actualEnd)
      const finalStart = newStart > endDate ? endDate : newStart

      onChange({
        ...page,
        completedDate: {
          start: formatDate(finalStart),
          end: completedDate.end ?? null,
        },
      })
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResizeRight = (e: React.MouseEvent) => {
    if (!canEdit || !isDone) return
    e.stopPropagation()

    const startX = e.clientX
    const originalEnd = new Date(actualEnd)

    const onMove = (moveEvent: MouseEvent) => {
      const dayChange = Math.round((moveEvent.clientX - startX) / DAY_WIDTH)
      const newEnd = addDays(originalEnd, dayChange)
      const startDate = new Date(actualStart)
      const finalEnd = newEnd < startDate ? startDate : newEnd

      const container = scrollRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        if (moveEvent.clientX > rect.right - 40) container.scrollLeft += 5
        if (moveEvent.clientX < rect.left + 40) container.scrollLeft -= 5
      }

      onChange({
        ...page,
        completedDate: {
          start: completedDate.start,
          end: formatDate(finalEnd),
        },
      })
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  return (
    <div
      onMouseDown={handleDrag}
      className={`absolute h-6 rounded-sm bg-linear-to-r from-pink-400 to-fuchsia-500 transition-all ${
        canEdit
          ? 'cursor-move opacity-95 hover:opacity-100 z-20 shadow-sm ring-1 ring-fuchsia-300/40'
          : 'cursor-default z-10 opacity-90'
      }`}
      style={{
        left: startOffset * DAY_WIDTH,
        width: duration * DAY_WIDTH,
        top: 'calc(50% - 20px)',
      }}
    >
      {canEdit && (
        <div
          onMouseDown={handleResizeLeft}
          className='absolute left-0 top-0 h-full w-3 bg-black/10 cursor-ew-resize hover:bg-black/20 transition-colors rounded-l-sm'
        />
      )}
      {canEdit && isDone && (
        <div
          onMouseDown={handleResizeRight}
          className='absolute right-0 top-0 h-full w-3 bg-black/10 cursor-ew-resize hover:bg-black/20 transition-colors rounded-r-sm'
        />
      )}
    </div>
  )
}
