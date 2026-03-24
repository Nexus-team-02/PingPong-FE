type Props = React.InputHTMLAttributes<HTMLInputElement>

export default function AuthInput(props: Props) {
  return (
    <input
      {...props}
      className='
        w-full h-10 rounded-[18px] border px-5 py-3 border-black/50 text-sm
        focus:border-api-blue focus:shadow-blue focus:outline-none
      '
    />
  )
}
