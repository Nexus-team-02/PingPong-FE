import { TASK_COL_WIDTH } from '@/shared/utils/date'

export default function TodayMarker({ DAY_WIDTH, offset }: { DAY_WIDTH: number; offset: number }) {
  return (
    <div
      className='pointer-events-none absolute top-0 bottom-0 z-10 flex flex-col items-center'
      style={{
        left: TASK_COL_WIDTH + offset * DAY_WIDTH,
        transform: 'translateX(-50%)',
      }}
    >
      <div className='mt-2 mb-1 rounded-full bg-api-green px-3 py-1 text-xs text-white shadow-sm'>
        Today
      </div>

      <div className='flex-1 border-l-2 border-dashed border-api-green' />
    </div>
  )
}
