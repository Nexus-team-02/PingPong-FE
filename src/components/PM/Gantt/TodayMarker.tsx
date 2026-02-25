import { TASK_COL_WIDTH } from '@/utils/date'

export default function TodayMarker({ DAY_WIDTH, offset }: { DAY_WIDTH: number; offset: number }) {
  return (
    <div
      className='pointer-events-none absolute top-0 bottom-0 z-20 flex flex-col items-center'
      style={{
        left: TASK_COL_WIDTH + offset * DAY_WIDTH,
        transform: 'translateX(-50%)',
      }}
    >
      <div className='mt-2 mb-1 rounded-full bg-api-green px-3 py-1 text-xs text-white shadow-sm'>
        Today
      </div>

      <svg className='mb-1 h-4 w-4 text-api-green' fill='currentColor' viewBox='0 0 20 20'>
        <path
          fillRule='evenodd'
          d='M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z'
          clipRule='evenodd'
        />
      </svg>

      <div className='flex-1 border-l-2 border-dashed border-api-green' />
    </div>
  )
}
