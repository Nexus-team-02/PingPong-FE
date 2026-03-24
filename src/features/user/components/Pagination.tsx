interface Props {
  current: number
  total: number
  onChange: (page: number) => void
}

export default function Pagination({ current, total, onChange }: Props) {
  return (
    <div className='flex justify-center gap-6 text-sm'>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i + 1)}
          className={current === i + 1 ? 'font-bold' : 'text-gray-400'}
        >
          {i + 1}
        </button>
      ))}
    </div>
  )
}
