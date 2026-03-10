import { getDayOffset, getToday } from '@/utils/date'
import { DateRange } from '@/types/gantt'

const DONE_STATUSES = ['완료', '완료됨', 'Done', 'Completed']

interface ActualBarProps {
  date: DateRange
  DAY_WIDTH: number
  status?: string
}

export default function ActualBar({ date, DAY_WIDTH, status }: ActualBarProps) {
  const today = getToday()
  const isDone = status ? DONE_STATUSES.includes(status) : false

  const startOffset = getDayOffset(date.start)
  const endOffset = isDone
    ? getDayOffset(date.end) + 1 // +1 로 마지막 날 포함
    : getDayOffset(
        `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
          today.getDate(),
        ).padStart(2, '0')}`,
      )

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
