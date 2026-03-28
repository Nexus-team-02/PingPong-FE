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
    tags: ['Components', 'Design Tokens', 'SDK', 'Examples'],
    progress: 91,
  },
  {
    role: 'PM/QA' as const,
    icon: '📋',
    docCount: 19,
    tags: ['Flowcharts', 'Specs', 'Test Cases', 'Releases'],
    progress: 67,
  },
]

export default function HomePage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500&family=DM+Mono:wght@400;500&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .anim-title  { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }
        .anim-body   { animation: fadeUp 0.6s 0.12s cubic-bezier(.22,1,.36,1) both; }
        .anim-card-0 { animation: cardIn 0.6s 0.22s cubic-bezier(.22,1,.36,1) both; }
        .anim-card-1 { animation: cardIn 0.6s 0.32s cubic-bezier(.22,1,.36,1) both; }
        .anim-card-2 { animation: cardIn 0.6s 0.42s cubic-bezier(.22,1,.36,1) both; }
      `}</style>

      <main className='home-bg min-h-screen' style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <section className='relative mx-auto max-w-6xl px-6 pt-20 pb-20'>
          <h1
            className='anim-title leading-none mt-10 mb-5 flex items-baseline gap-5 flex-wrap'
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <span className='text-[clamp(56px,9vw,108px)] font-extrabold tracking-tight text-gray-900'>
              API
            </span>
            <span className='text-[clamp(40px,6vw,72px)] font-extrabold text-gray-300 tracking-tight'>
              &amp;
            </span>
            <span
              className='text-[clamp(56px,9vw,108px)] font-extrabold tracking-tight'
              style={{
                WebkitTextStroke: '2.5px #111827',
                color: 'transparent',
              }}
            >
              DOCS
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className='anim-body text-[15px] text-gray-500 leading-relaxed mb-14'
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            역할에 맞는 트랙을 선택하고 NEXUS와 함께 빠르게 시작하세요.{' '}
            <span className='text-gray-700 font-medium'>백엔드, 프론트엔드, PM/QA</span> 모두를 위한
            전용 문서를 제공합니다.
          </p>

          {/* Cards */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {ROLES.map((r, i) => (
              <div key={r.role} className={`anim-card-${i}`}>
                <RoleCard {...r} index={i} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  )
}
