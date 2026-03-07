import { ReactNode } from 'react'
import Close from '@/assets/close.svg?react'

interface ModalProps {
  title: string
  children: ReactNode
  bg?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  onClose: () => void
}

const sizeMap = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
}

export default function Modal({ title, children, bg = 'white', size = 'md', onClose }: ModalProps) {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/40' onClick={onClose} />

      <div className={`relative z-10 w-full ${sizeMap[size]} rounded-xl bg-white shadow-lg`}>
        <div className='flex items-center justify-between px-5 py-3'>
          <h2 className='text-base font-semibold text-gray-900'>{title}</h2>
          <button
            onClick={onClose}
            className='text-gray-400 hover:text-gray-600'
            aria-label='Close modal'
          >
            <Close className='w-6 h-6 cursor-pointer' />
          </button>
        </div>

        <div className={`px-5 py-4 rounded-b-xl ${bg}`}>{children}</div>
      </div>
    </div>
  )
}
