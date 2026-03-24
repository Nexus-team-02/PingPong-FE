import Left from '@/assets/left.svg?react'
import Right from '@/assets/right.svg?react'

interface Props {
  direction: 'left' | 'right'
  onClick: () => void
  disabled?: boolean
}

export default function SliderArrow({ direction, onClick, disabled }: Props) {
  const Icon = direction === 'left' ? Left : Right

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === 'left' ? 'previous' : 'next'}
      className={`mx-8 absolute top-1/2 -translate-y-1/2 cursor-pointer
        ${direction === 'left' ? 'left-2' : 'right-2'}
        w-10 h-10`}
    >
      <Icon className='w-full h-full' />
    </button>
  )
}
