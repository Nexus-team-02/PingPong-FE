interface Props {
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
  children: React.ReactNode
}

export default function AuthForm({ onSubmit, children }: Props) {
  return (
    <form onSubmit={onSubmit} className='flex flex-col gap-6'>
      {children}
    </form>
  )
}
