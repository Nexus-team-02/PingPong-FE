import { Page } from '@/features/pm/types/gantt'

const DONE_STATUSES = ['완료', '완료됨', 'Done', 'Completed']

interface DashboardStatsProps {
  pages: Page[]
  sprintName?: string
}

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DashboardStats({ pages, sprintName = 'Sprint 1' }: DashboardStatsProps) {
  const total = pages.length
  const done = pages.filter((p) => p.status && DONE_STATUSES.includes(p.status))
  const inProgress = pages.filter((p) => p.date && (!p.status || !DONE_STATUSES.includes(p.status)))

  const allStarts = pages.filter((p) => p.date).map((p) => p.date!.start)
  const allEnds = pages.filter((p) => p.date).map((p) => p.date!.end)
  const minStart = allStarts.length ? [...allStarts].sort()[0] : null
  const maxEnd = allEnds.length ? [...allEnds].sort().reverse()[0] : null

  const sprintRange =
    minStart && maxEnd
      ? `${sprintName} · ${formatDateShort(minStart)} – ${formatDateShort(maxEnd)}`
      : sprintName

  const progressPct = total > 0 ? Math.round((done.length / total) * 100) : 0
  const inProgressPct = total > 0 ? Math.round((inProgress.length / total) * 100) : 0

  const firstDone = done[0]
  let completedSubtitle = done.length > 0 ? (firstDone?.title ?? '—') : 'Nothing completed yet'
  if (firstDone?.date && firstDone?.completedDate?.end) {
    const plannedEnd = new Date(firstDone.date.end)
    const actualEnd = new Date(firstDone.completedDate.end)
    const diffDays = Math.round(
      (plannedEnd.getTime() - actualEnd.getTime()) / (1000 * 60 * 60 * 24),
    )
    const suffix =
      diffDays > 0 ? `ahead of plan` : diffDays < 0 ? `${Math.abs(diffDays)}d late` : 'on schedule'
    completedSubtitle = `${firstDone.title} — ${suffix}`
  }

  const cards = [
    {
      label: 'TOTAL TASKS',
      count: total,
      subtitle: sprintRange,
      pct: progressPct,
    },
    {
      label: 'IN PROGRESS',
      count: inProgress.length,
      subtitle: inProgress.map((p) => p.title).join(', ') || 'No active tasks',
      pct: inProgressPct,
    },
    {
      label: 'COMPLETED',
      count: done.length,
      subtitle: completedSubtitle,
      pct: progressPct,
    },
  ]

  return (
    <div className='grid grid-cols-3 gap-4 mb-8'>
      {cards.map((card) => (
        <div
          key={card.label}
          className='bg-white rounded-xl border border-gray-100 shadow-sm px-6 pt-5 pb-0 flex flex-col overflow-hidden'
        >
          <p className='text-[10px] font-bold tracking-[0.12em] text-gray-400 uppercase mb-2'>
            {card.label}
          </p>
          <p className='text-3xl font-bold text-gray-900 leading-none mb-2'>{card.count}</p>
          <p className='text-xs text-gray-400 mb-4 truncate'>{card.subtitle}</p>
          <div className='mt-auto -mx-6'>
            <div className='w-full h-1 bg-gray-100'>
              <div
                className='h-full bg-linear-to-r from-pink-400 to-fuchsia-500 transition-all duration-700'
                style={{ width: `${card.pct}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
