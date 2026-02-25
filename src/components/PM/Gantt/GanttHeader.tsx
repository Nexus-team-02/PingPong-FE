export default function GanttHeader({
  isEditing,
  onToggleEdit,
}: {
  isEditing: boolean
  onToggleEdit: () => void
}) {
  return (
    <div className='mb-8 flex justify-end items-end'>
      <div className='flex items-center gap-6'>
        <div className='flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm text-sm font-medium border border-gray-100'>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-gray-300 rounded-sm' />
            <span className='text-gray-600'>Planned</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-4 h-4 bg-linear-to-r from-pink-300 to-fuchsia-400 rounded-sm' />
            <span className='text-gray-600'>Actual</span>
          </div>
        </div>

        <button
          onClick={onToggleEdit}
          className={`cursor-pointer px-6 py-2 rounded-full font-bold shadow-sm text-sm transition-colors border ${
            isEditing
              ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
              : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isEditing ? 'Finish Editing' : 'Edit mode'}
        </button>
      </div>
    </div>
  )
}
