export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className='w-full max-w-xl rounded-2xl bg-white p-4 shadow-lg'>
      <div className='h-full border border-gray-200 rounded-xl px-20 pt-12 pb-8'>{children}</div>
    </div>
  )
}
