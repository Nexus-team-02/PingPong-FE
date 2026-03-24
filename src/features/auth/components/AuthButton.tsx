type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode
}

export default function AuthButton({ children, ...props }: Props) {
  return (
    <button
      {...props}
      className='cursor-pointer mt-8 w-full rounded-[10px] bg-api-blue py-3 text-white font-semibold'
    >
      {children}
    </button>
  )
}
