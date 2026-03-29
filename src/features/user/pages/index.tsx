import RoleCard from '@/features/user/components/RoleCard'

const ROLES = [
  {
    role: 'BACKEND' as const,
    icon: '⚙️',
    docCount: 32,
    tags: ['REST API', 'Auth', 'Database', 'Webhooks'],
    progress: 84,
  },
  {
    role: 'FRONTEND' as const,
    icon: '🎨',
    docCount: 41,
    tags: ['Flows', 'Swagger', 'API Test', 'Examples'],
    progress: 91,
  },
  {
    role: 'PM/QA' as const,
    icon: '📋',
    docCount: 19,
    tags: ['Ganttcharts', 'Specs', 'Test Cases', 'Releases'],
    progress: 67,
  },
]

const CARD_DELAYS = ['anim-delay-[0.22s]', 'anim-delay-[0.32s]', 'anim-delay-[0.42s]']

export default function HomePage() {
  return (
    <main className='bg-dot-layout min-h-screen'>
      <section className='relative mx-auto max-w-6xl px-6 pt-20 pb-20'>
        <h1 className='animate-fade-up font-syne mt-10 mb-5 flex flex-wrap items-baseline gap-5 leading-none'>
          <span className='text-8xl font-extrabold tracking-tight text-gray-900'>API</span>
          <span className='text-[clamp(40px,6vw,72px)] font-extrabold tracking-tight text-gray-300'>
            &amp;
          </span>
          <span
            className='text-8xl font-extrabold tracking-tight'
            style={{ WebkitTextStroke: '2.5px #111827', color: 'transparent' }}
          >
            DOCS
          </span>
        </h1>

        <p className='animate-fade-up font-dm-sans anim-delay-[0.12s] mb-14 text-[15px] leading-relaxed text-gray-500'>
          역할에 맞는 트랙을 선택하고 NEXUS와 함께 빠르게 시작하세요.{' '}
          <span className='font-medium text-gray-700'>백엔드, 프론트엔드, PM/QA</span> 모두를 위한
          전용 문서를 제공합니다.
        </p>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
          {ROLES.map((r, i) => (
            <div key={r.role} className={`animate-card-in ${CARD_DELAYS[i]}`}>
              <RoleCard {...r} index={i} />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
