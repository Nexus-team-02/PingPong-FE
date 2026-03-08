import { HttpMethod } from '@/types/api'
import { METHOD_STYLE } from '@/constants/method'

export default function Section({
  title,
  children,
  method,
  rightElement,
}: {
  title: string
  children: React.ReactNode
  method: HttpMethod
  rightElement?: React.ReactNode
}) {
  return (
    <div className='overflow-hidden rounded bg-white shadow-sm'>
      <div
        className={`flex items-center justify-between border-b px-4 py-3 ${METHOD_STYLE[method].border} bg-gray-50/50`}
      >
        <h4 className='text-sm font-semibold text-gray-800'>{title}</h4>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className='px-4 py-4'>{children}</div>
    </div>
  )
}
