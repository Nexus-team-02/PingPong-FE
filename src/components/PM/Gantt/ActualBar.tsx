import { getDayOffset, getToday } from '@/utils/date'
import { DateRange } from '@/types/gantt'

const DONE_STATUSES = ['완료', '완료됨', 'Done', 'Completed']

interface ActualBarProps {
  date: DateRange
  completedDate: DateRange | null
  DAY_WIDTH: number
  status?: string
}

export default function ActualBar({ date, completedDate, DAY_WIDTH, status }: ActualBarProps) {
  const today = getToday()
  const isDone = status ? DONE_STATUSES.includes(status) : false

  const startOffset = getDayOffset(date.start)

  let endOffset: number
  if (isDone) {
    // 완료 상태: completedDate 있으면 그걸로, null이면 date.end 로 fallback
    const endDate = completedDate?.end ?? completedDate?.start ?? date.end
    endOffset = getDayOffset(endDate)
  } else {
    // 진행 중이면 오늘까지
    endOffset = getDayOffset(
      `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
        today.getDate(),
      ).padStart(2, '0')}`,
    )
  }

  const duration = endOffset - startOffset
  if (duration <= 0) return null

  return (
    <div
      className='absolute h-8 rounded-sm bg-linear-to-r from-pink-300 to-fuchsia-400 shadow-sm z-10 pointer-events-none'
      style={{
        left: startOffset * DAY_WIDTH,
        width: duration * DAY_WIDTH,
      }}
    />
  )
}
