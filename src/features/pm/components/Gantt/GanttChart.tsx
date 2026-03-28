import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Plus from '@/assets/plus.svg?react'
import GanttHeader from './GanttHeader'
import GanttGridHeader from './GanttGridHeader'
import GridLines from './GridLines'
import TaskRow from './TaskRow'
import DashboardStats from './DashboardStats'
import { DAY_WIDTH, NUM_DAYS, TASK_COL_WIDTH } from '@/shared/utils/date'
import { GanttScrollProvider } from '@/features/pm/hooks/useGanttScroll'
import { useGanttTasks } from '@/features/pm/hooks/useGanttTasks'

function GanttSkeleton() {
  const rows = Array.from({ length: 6 })
  const bars = [
    { left: '10%', width: '30%' },
    { left: '25%', width: '45%' },
    { left: '5%', width: '20%' },
    { left: '40%', width: '35%' },
    { left: '15%', width: '50%' },
    { left: '30%', width: '25%' },
  ]

  return (
    <div className='min-w-[80%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl animate-pulse'>
      <div className='flex border-b border-gray-100'>
        <div
          className='shrink-0 bg-gray-50 border-r border-gray-100'
          style={{ width: TASK_COL_WIDTH }}
        >
          <div className='h-12 flex items-center px-4'>
            <div className='h-3 w-20 bg-gray-200 rounded-full' />
          </div>
        </div>
        <div className='flex-1 h-12 flex items-center gap-6 px-6'>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className='h-2.5 w-10 bg-gray-100 rounded-full' />
          ))}
        </div>
      </div>

      {rows.map((_, rowIdx) => (
        <div key={rowIdx} className='flex border-b border-gray-100 last:border-0'>
          <div
            className='shrink-0 flex items-center px-4 border-r border-gray-100 bg-white'
            style={{ width: TASK_COL_WIDTH, height: 64 }}
          >
            <div className='flex flex-col gap-1.5 w-full'>
              <div
                className='h-2.5 bg-gray-200 rounded-full'
                style={{ width: `${50 + ((rowIdx * 13) % 35)}%` }}
              />
              <div
                className='h-2 bg-gray-100 rounded-full'
                style={{ width: `${30 + ((rowIdx * 7) % 25)}%` }}
              />
            </div>
          </div>

          <div className='flex-1 relative flex items-center px-2' style={{ height: 64 }}>
            <div
              className='absolute h-7 rounded-full bg-linear-to-r from-pink-100 to-pink-200'
              style={{ left: bars[rowIdx].left, width: bars[rowIdx].width }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function GanttChart() {
  const { teamId } = useParams()
  const numericTeamId = Number(teamId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { pages, addTask, updateTask, saveAll, loading } = useGanttTasks(numericTeamId)

  const handleToggleEdit = async () => {
    if (isEditing) {
      setIsSaving(true)
      try {
        const isSuccess = await saveAll()
        if (isSuccess) setIsEditing(false)
      } finally {
        setIsSaving(false)
      }
    } else {
      setIsEditing(true)
    }
  }

  return (
    <div className='relative overflow-hidden pb-20'>
      <main className='relative z-10 mx-auto mt-12 max-w-7xl'>
        <DashboardStats pages={pages} />

        <GanttHeader isEditing={isEditing} isSaving={isSaving} onToggleEdit={handleToggleEdit} />

        {loading ? (
          <GanttSkeleton />
        ) : (
          <div className='min-w-[80%] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl'>
            <GanttScrollProvider value={scrollRef}>
              <div ref={scrollRef} className='w-full overflow-x-auto scrollbar-hide'>
                <div className='relative min-w-max'>
                  <GanttGridHeader DAY_WIDTH={DAY_WIDTH} numDays={NUM_DAYS} />

                  <div className='relative'>
                    <GridLines DAY_WIDTH={DAY_WIDTH} numDays={NUM_DAYS} />

                    <div className='relative z-10'>
                      {pages.map((page) => (
                        <TaskRow
                          key={page.id}
                          page={page}
                          isEditing={isEditing}
                          onChange={updateTask}
                          DAY_WIDTH={DAY_WIDTH}
                        />
                      ))}

                      {isEditing && (
                        <div
                          className='sticky left-0 z-30 flex h-16 shrink-0 items-center justify-center bg-white border-r border-t border-gray-100'
                          style={{ width: TASK_COL_WIDTH }}
                        >
                          <button
                            onClick={addTask}
                            className='flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-pink-500 transition-colors'
                          >
                            <Plus className='w-4 h-4' />
                            Add task
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </GanttScrollProvider>
          </div>
        )}
      </main>
    </div>
  )
}
