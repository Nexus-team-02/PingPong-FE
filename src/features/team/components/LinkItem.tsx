interface LinkItemProps {
  label: string
  placeholder: string
  icon: React.ReactNode
  value: string
  onChange: (value: string) => void
}

export default function LinkItem({ label, placeholder, icon, value, onChange }: LinkItemProps) {
  return (
    <div className='rounded-xl border border-black/10 bg-white/70 p-4'>
      <div className='flex items-center gap-3 mb-3'>
        <div className='w-6 h-6 flex items-center justify-center'>{icon}</div>
        <span className='font-semibold text-sm'>{label}</span>
      </div>

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className='
          w-full rounded-md border border-black/10
          px-3 py-2 text-sm
          outline-none
          focus:border-black/30 focus:ring-1 focus:ring-black/20
        '
      />
    </div>
  )
}
