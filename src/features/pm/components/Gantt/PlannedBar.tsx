import { getDayOffset, addDays, formatDate } from '@/shared/utils/date'
import { Page } from '@/features/pm/types/gantt'
import { useGanttScroll } from '@/features/pm/hooks/useGanttScroll'

export default function PlannedBar({
  page,
  isEditing,
  onChange,
  DAY_WIDTH,
}: {
  page: Page
  isEditing: boolean
  onChange: (page: Page) => void
  DAY_WIDTH: number
}) {
  const scrollRef = useGanttScroll()
  if (!page.date) return null

  const startOffset = getDayOffset(page.date.start)
  const endOffset = getDayOffset(page.date.end)
  const duration = endOffset - startOffset

  const handleDrag = (e: React.MouseEvent) => {
    if (!isEditing || !page.date) return

    const startX = e.clientX
    const originalStart = new Date(page.date.start)
    const originalEnd = new Date(page.date.end)

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const dayChange = Math.round(delta / DAY_WIDTH)

      const newStart = addDays(originalStart, dayChange)
      const newEnd = addDays(originalEnd, dayChange)

      onChange({
        ...page,
        date: { start: formatDate(newStart), end: formatDate(newEnd) },
      })
    }

    const onUp = () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const handleResize = (e: React.MouseEvent) => {
    if (!isEditing || !page.date) return
    e.stopPropagation()

    const startX = e.clientX
    const originalEnd = new Date(page.date.end)

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX
      const dayChange = Math.round(delta / DAY_WIDTH)
      const newEnd = addDays(originalEnd, dayChange)
      const startDate = new Date(page.date!.start)
      const finalEnd = newEnd < startDate ? startDate : newEnd

      const container = scrollRef.current
      if (container) {
        const rect = container.getBoundingClientRect()
        const edgeThreshold = 40
        const scrollSpeed = 5

        if (moveEvent.clientX > rect.right - edgeThreshold) {
          container.scrollLeft += scrollSpeed
        }

        if (moveEvent.clientX < rect.left + edgeThreshold) {
          container.scrollLeft -= scrollSpeed
        }
      }

      onChange({
        ...page,
        date: { ...page.date!, end: formatDate(finalEnd) },
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
      className={`absolute h-8 rounded-sm bg-gray-300 transition-all ${
        isEditing
          ? 'cursor-move opacity-90 hover:opacity-100 z-20 shadow-md ring-1 ring-black/5'
          : 'cursor-default z-0 opacity-50'
      }`}
      style={{
        left: startOffset * DAY_WIDTH,
        width: duration * DAY_WIDTH,
        top: isEditing ? 'calc(50% - 12px)' : 'calc(50% - 16px)',
      }}
    >
      {isEditing && (
        <div
          onMouseDown={handleResize}
          className='absolute right-0 top-0 h-full w-3 bg-black/10 cursor-ew-resize hover:bg-black/20 transition-colors rounded-r-sm'
        />
      )}
    </div>
  )
}
