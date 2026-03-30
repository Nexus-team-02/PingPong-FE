import { useNavigate } from 'react-router-dom'

interface RoleCardProps {
  role: 'BACKEND' | 'FRONTEND' | 'PM/QA'
  icon: string
  docCount: number
  tags: string[]
  progress: number
  index: number
}

const ROLE_CONFIG = {
  BACKEND: {
    label: 'Backend',
    sub: 'Server & API',
    accent: '#d97706',
    tint: 'rgba(217,119,6,0.06)',
    tintHover: 'rgba(217,119,6,0.1)',
    tagline: 'REST API, 인증 흐름, 데이터베이스 연동까지. 서버 개발자를 위한 완전한 레퍼런스.',
    startAs: 'back-end developer',
    num: '01',
  },
  FRONTEND: {
    label: 'Frontend',
    sub: 'UI & Components',
    accent: '#2563eb',
    tint: 'rgba(37,99,235,0.06)',
    tintHover: 'rgba(37,99,235,0.1)',
    tagline: '플로우 관리, 서버 연동 테스트, 연동 가이드라인. 프론트 개발자를 위한 모든 것.',
    startAs: 'front-end developer',
    num: '02',
  },
  'PM/QA': {
    label: 'PM / QA',
    sub: 'Process & Quality',
    accent: '#059669',
    tint: 'rgba(5,150,105,0.06)',
    tintHover: 'rgba(5,150,105,0.1)',
    tagline: 'Gantt 차트, 요구사항 명세, 테스트 시나리오. 기획·QA를 위한 구조화된 가이드.',
    startAs: 'product manager',
    num: '03',
  },
}

export default function RoleCard({ role, icon, tags }: RoleCardProps) {
  const cfg = ROLE_CONFIG[role]
  const navigate = useNavigate()

  return (
    <div
      className='group relative flex flex-col rounded-2xl bg-white'
      style={{
        border: '1.5px solid #e5e7eb',
        transition: 'border-color 0.22s, box-shadow 0.22s, transform 0.22s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = cfg.accent
        el.style.boxShadow = `0 12px 40px rgba(0,0,0,0.09), 0 0 0 1px ${cfg.accent}`
        el.style.transform = 'translateY(-4px)'
        const tint = el.querySelector<HTMLElement>('.card-tint')
        if (tint) tint.style.background = cfg.tintHover
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = '#e5e7eb'
        el.style.boxShadow = 'none'
        el.style.transform = 'translateY(0)'
        const tint = el.querySelector<HTMLElement>('.card-tint')
        if (tint) tint.style.background = cfg.tint
      }}
    >
      {/* Tinted header */}
      <div
        className='card-tint rounded-t-[14px] px-5 pt-5 pb-4'
        style={{ background: cfg.tint, transition: 'background 0.22s' }}
      >
        <div className='flex items-start justify-between mb-4'>
          <div
            className='w-11 h-11 rounded-xl bg-white flex items-center justify-center text-xl'
            style={{
              border: '1px solid rgba(0,0,0,0.07)',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            {icon}
          </div>
          <span
            className='text-[11px] font-mono font-bold tracking-[0.2em]'
            style={{ color: cfg.accent, opacity: 0.4 }}
          >
            {cfg.num}
          </span>
        </div>

        <h2
          className='text-[30px] font-black leading-none tracking-tight text-gray-900 mb-1.5'
          style={{ fontFamily: "'Syne', 'DM Sans', sans-serif" }}
        >
          {cfg.label}
        </h2>
      </div>

      {/* Content */}
      <div className='flex flex-col flex-1 px-5 pt-4 pb-5 gap-4'>
        <p className='text-[13px] text-gray-500 leading-relaxed'>{cfg.tagline}</p>

        {/* Tags */}
        <div className='flex flex-wrap gap-1.5'>
          {tags.map((tag) => (
            <span
              key={tag}
              className='text-[10px] font-mono px-2 py-0.5 rounded-md'
              style={{
                background: cfg.tint,
                color: cfg.accent,
                border: `1px solid ${cfg.accent}28`,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className='flex-1' />

        {/* Footer */}
        <div className='flex items-center justify-between pt-3 border-t border-gray-100'>
          <div>
            <p className='text-[11px] text-gray-400 font-mono leading-snug'>Start 'NEXUS'</p>
            <p className='text-[11px] text-gray-400 font-mono leading-snug'>as a {cfg.startAs}</p>
          </div>

          <button
            onClick={() => navigate('/mypage')}
            className='cursor-pointer flex items-center gap-2 px-4 py-2 rounded-lg text-[12px] font-bold tracking-wider transition-all duration-150 active:scale-95 hover:opacity-85'
            style={{ background: cfg.accent, color: '#fff', letterSpacing: '0.05em' }}
          >
            START
          </button>
        </div>
      </div>
    </div>
  )
}
