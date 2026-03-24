interface Props {
  message?: string
}

export default function ErrorMessage({ message = '오류가 발생했습니다.' }: Props) {
  return (
    <div className='min-h-screen flex items-center justify-center text-gray-500'>{message}</div>
  )
}
