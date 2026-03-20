import Right from '@/assets/right.svg?react'

interface CategoryCardProps {
  title: string
  description: string
}

export default function CategoryCard({ title, description }: CategoryCardProps) {
  return (
    // 기존 스타일 유지 (h-[50vh]만 제거하여 압축)
    <div className='group relative rounded-2xl bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-lg cursor-pointer'>
      {/* 내부 콘텐츠 정렬을 중앙에서 좌측 상단으로 변경하여 읽기 편하게 구성 */}
      <div className='border border-gray-200 rounded-2xl p-6 flex flex-col justify-between min-h-[220px] h-full'>
        <div>
          <h2 className='mb-3 text-2xl font-extrabold text-gray-900'>{title}</h2>
          {/* 기존 text-gray-300은 너무 연해서 가독성을 위해 살짝 진하게 조정 */}
          <p className='text-sm text-gray-400 whitespace-pre-line leading-relaxed'>{description}</p>
        </div>

        {/* 화살표를 우측 하단으로 자연스럽게 배치 */}
        <div className='mt-6 self-end transition group-hover:translate-x-1'>
          <Right className='w-8 h-8 text-gray-900' />
        </div>
      </div>
    </div>
  )
}
