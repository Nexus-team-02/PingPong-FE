import { useState, useRef } from 'react'

export interface FloatingNavSubItem {
  id: string
  label: string
}

export interface FloatingNavItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  isVisible?: boolean
  labelBgClass?: string
  iconTextClass?: string
  subItems?: FloatingNavSubItem[] // ← 추가
  onSubItemClick?: (id: string) => void // ← 추가
}

interface Props {
  items: FloatingNavItem[]
}

export default function FloatingNav({ items }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleMouseEnter = (id: string) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setHoveredId(id)
  }

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setHoveredId(null), 150)
  }

  return (
    <div className='fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3'>
      {items
        .filter((item) => item.isVisible !== false)
        .map((item) => {
          const isHovered = hoveredId === item.id
          const hasSubItems = item.subItems && item.subItems.length > 0

          return (
            <div
              key={item.id}
              className='relative flex items-center justify-end cursor-pointer'
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* 서브메뉴 */}
              {hasSubItems && isHovered && (
                <div
                  className='absolute right-12 bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-40 animate-fade-in cursor-pointer'
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item.subItems!.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => item.onSubItemClick?.(sub.id)}
                      className='cursor-pointer w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors'
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              )}

              {/* 라벨 툴팁 (subItems 없을 때만) */}
              {!hasSubItems && isHovered && (
                <span
                  className={`cursor-pointer absolute right-12 px-3 py-1 rounded-lg text-white text-sm font-medium whitespace-nowrap animate-fade-in ${item.labelBgClass ?? 'bg-gray-800'}`}
                >
                  {item.label}
                </span>
              )}

              {/* 아이콘 버튼 */}
              <button
                onClick={item.onClick}
                className={`cursor-pointer w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center transition-transform hover:scale-110 ${item.iconTextClass ?? 'text-gray-700'}`}
              >
                {item.icon}
              </button>
            </div>
          )
        })}
    </div>
  )
}
