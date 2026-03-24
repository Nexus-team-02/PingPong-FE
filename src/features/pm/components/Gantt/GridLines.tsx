import { TASK_COL_WIDTH } from '@/shared/utils/date'

export default function GridLines({ DAY_WIDTH, numDays }: { DAY_WIDTH: number; numDays: number }) {
  return (
    <div
      className='absolute top-0 bottom-0 right-0 flex pointer-events-none z-0 pl-20'
      style={{ left: TASK_COL_WIDTH }}
    >
      {[...Array(numDays)].map((_, i) => (
        <div
          key={i}
          className={`shrink-0 border-l border-gray-100 h-full`}
          style={{ width: DAY_WIDTH }}
        />
      ))}
    </div>
  )
}
