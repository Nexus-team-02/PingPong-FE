export default function QaCaseSection({
  title,
  children,
  rightElement,
}: {
  title: string
  children: React.ReactNode
  rightElement?: React.ReactNode
}) {
  return (
    <div className='overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm'>
      <div className='flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2.5'>
        <h4 className='text-sm font-semibold text-gray-800'>{title}</h4>
        {rightElement && <div>{rightElement}</div>}
      </div>
      <div className='px-4 py-4'>{children}</div>
    </div>
  )
}
