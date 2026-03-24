interface TitleProps {
  children: React.ReactNode
  right?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
}

export default function Title({ children, right, size = 'md' }: TitleProps) {
  return (
    <div className='flex flex-col justify-between mb-4 w-full'>
      <div className='flex justify-between items-center'>
        <h2 className={`tracking-tight font-bold text-black ${sizeMap[size]}`}>{children}</h2>
        {right && <div>{right}</div>}
      </div>

      <div className='w-full border-b border-black mt-3' />
    </div>
  )
}
