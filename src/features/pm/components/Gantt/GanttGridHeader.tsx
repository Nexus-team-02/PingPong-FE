import { TASK_COL_WIDTH, addDays, formatHeaderDate, BASE_DATE } from '@/shared/utils/date'

export default function GanttGridHeader({
  DAY_WIDTH,
  numDays,
}: {
  DAY_WIDTH: number
  numDays: number
}) {
  const today = new Date()

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  return (
    <div className='flex items-end sticky top-0 bg-white border-b border-gray-100 h-20 pr-20'>
      <div
        className='shrink-0 sticky left-0 bg-white z-50 pl-8 pr-4 pb-4 font-bold text-lg border-r border-gray-100 flex items-end h-full'
        style={{ width: TASK_COL_WIDTH }}
      >
        Task
      </div>

      <div className='flex flex-1 pb-4 ml-3'>
        {[...Array(numDays)].map((_, i) => {
          const d = addDays(BASE_DATE, i)
          const isToday = isSameDay(d, today)

          return (
            <div
              key={i}
              className={`text-end font-bold text-sm shrink-0 ${
                isToday ? 'text-api-green' : 'text-gray-500'
              }`}
              style={{ width: DAY_WIDTH }}
            >
              {formatHeaderDate(d)}
            </div>
          )
        })}
      </div>
    </div>
  )
}
