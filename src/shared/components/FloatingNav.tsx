import React from 'react'

export interface FloatingNavItem {
  id: string
  label: string
  icon: React.ReactNode
  onClick: () => void
  isVisible?: boolean
  labelBgClass?: string
  iconTextClass?: string
}

interface FloatingNavProps {
  items: FloatingNavItem[]
}

export default function FloatingNav({ items }: FloatingNavProps) {
  return (
    <div className='fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-50'>
      {items.map((item) => {
        // isVisible이 명시적으로 false인 경우 렌더링하지 않음
        if (item.isVisible === false) return null

        const bgClass = item.labelBgClass || 'bg-gray-800'
        const textClass = item.iconTextClass || 'text-gray-700'

        return (
          <button
            key={item.id}
            onClick={item.onClick}
            className='group flex items-center justify-end gap-2'
          >
            {/* Hover 시 나타나는 라벨 */}
            <span
              className={`rounded-md px-2 py-1 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 ${bgClass}`}
            >
              {item.label}
            </span>
            {/* 동그란 아이콘 버튼 */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-transform hover:scale-110 hover:text-black ${textClass}`}
            >
              {item.icon}
            </div>
          </button>
        )
      })}
    </div>
  )
}
