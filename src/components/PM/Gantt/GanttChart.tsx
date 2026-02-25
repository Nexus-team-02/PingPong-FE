import { useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import Plus from '@/assets/plus.svg?react'
import GanttHeader from './GanttHeader'
import GanttGridHeader from './GanttGridHeader'
import GridLines from './GridLines'
import TaskRow from './TaskRow'
import TodayMarker from './TodayMarker'
import { DAY_WIDTH, NUM_DAYS, TASK_COL_WIDTH } from '@/utils/date'
import { GanttScrollProvider } from '@/hook/useGanttScroll'
import { useGanttTasks } from '@/hook/useGanttTasks'

export default function GanttChart() {
  const { teamId } = useParams()
  const numericTeamId = Number(teamId)
  const scrollRef = useRef<HTMLDivElement>(null)

  const [isEditing, setIsEditing] = useState(false)

  const { pages, loading, error, addTask, updateTask, saveAll } = useGanttTasks(numericTeamId)

  const handleToggleEdit = async () => {
    if (isEditing) {
      const isSuccess = await saveAll()
      if (isSuccess) setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  if (loading) return <div className='p-10'>Loading...</div>
  if (error) return <div className='p-10 text-red-500'>Failed to load tasks.</div>

  return (
    <div className='relative overflow-hidden pb-20'>
      <main className='relative z-10 mx-auto mt-12 max-w-7xl px-10'>
        <GanttHeader isEditing={isEditing} onToggleEdit={handleToggleEdit} />

        <div className='min-w-[80%] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl'>
          <GanttScrollProvider value={scrollRef}>
            <div ref={scrollRef} className='w-full overflow-x-auto scrollbar-hide'>
              <div className='relative min-w-max'>
                <TodayMarker DAY_WIDTH={DAY_WIDTH} offset={9} />
                <GanttGridHeader DAY_WIDTH={DAY_WIDTH} numDays={NUM_DAYS} />

                <div className='relative'>
                  <GridLines DAY_WIDTH={DAY_WIDTH} numDays={NUM_DAYS} />

                  <div className='relative z-40 y-5 min-h-20'>
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
                        className='sticky left-0 z-30 flex h-20 shrink-0 items-center justify-center bg-white'
                        style={{ width: TASK_COL_WIDTH }}
                      >
                        <Plus
                          onClick={addTask}
                          className='flex h-8 w-8 items-center justify-center rounded-full text-white shadow-md transition-transform hover:scale-105 cursor-pointer'
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </GanttScrollProvider>
        </div>
      </main>
    </div>
  )
}
