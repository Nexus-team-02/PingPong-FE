import Search from '@/assets/search.svg?react'

interface SearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div
      className='flex items-center gap-2 px-3 py-2 rounded-md border border-black/10 bg-white/20
                 focus-within:border-black/30 focus-within:shadow-sm transition w-65'
    >
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='Search your project'
        className='flex-1 text-sm outline-none placeholder:text-black/40 tracking-tight'
      />

      <div className='w-4 h-4 flex items-center justify-center text-black/40'>
        <Search />
      </div>
    </div>
  )
}
