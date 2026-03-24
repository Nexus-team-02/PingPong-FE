import Right from '@/assets/right.svg?react'

interface RoleCardProps {
  title: string
  description: string
}

export default function RoleCard({ title, description }: RoleCardProps) {
  return (
    <div className='group relative rounded-2xl bg-white p-4 shadow-lg transition hover:-translate-y-1 hover:shadow-lg h-[50vh]'>
      <div className='h-full border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center'>
        <h2 className='mb-4 text-2xl font-extrabold'>{title}</h2>
        <p className='mb-[20vh] text-xs text-gray-300 whitespace-pre-line text-center'>
          {description}
        </p>

        <button className='transition group-hover:scale-105'>
          <Right className='w-10 h-10 cursor-pointer' />
        </button>
      </div>
    </div>
  )
}
