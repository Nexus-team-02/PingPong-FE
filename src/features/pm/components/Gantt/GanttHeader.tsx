interface GanttHeaderProps {
  isEditing: boolean
  isSaving: boolean
  onToggleEdit: () => void
}

export default function GanttHeader({ isEditing, isSaving, onToggleEdit }: GanttHeaderProps) {
  return (
    <div className='mb-5 flex justify-between items-center'>
      <p className='text-xs font-bold tracking-widest text-gray-400 uppercase'>
        Timeline ·{' '}
        {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }).toUpperCase()}
      </p>

      <div className='flex items-center gap-4'>
        <div className='flex items-center gap-4 bg-white px-4 py-2 rounded-full shadow-sm text-xs font-medium border border-gray-100'>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-2 bg-gray-300 rounded-sm' />
            <span className='text-gray-500'>Planned</span>
          </div>
          <div className='flex items-center gap-2'>
            <div className='w-5 h-2 bg-linear-to-r from-pink-400 to-fuchsia-500 rounded-sm' />
            <span className='text-gray-500'>Actual</span>
          </div>
        </div>

        <button
          onClick={onToggleEdit}
          disabled={isSaving}
          className={`cursor-pointer px-5 py-2 rounded-full font-semibold shadow-sm text-xs tracking-wide transition-all border flex items-center gap-2 min-w-27.5 justify-center ${
            isSaving
              ? 'bg-pink-50 text-pink-400 border-pink-100 cursor-not-allowed'
              : isEditing
                ? 'bg-pink-500 text-white border-pink-500 hover:bg-pink-600'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
          }`}
        >
          {isSaving ? (
            <>
              <svg
                className='animate-spin h-3 w-3 text-pink-400 shrink-0'
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
              >
                <circle
                  className='opacity-25'
                  cx='12'
                  cy='12'
                  r='10'
                  stroke='currentColor'
                  strokeWidth='4'
                />
                <path
                  className='opacity-75'
                  fill='currentColor'
                  d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'
                />
              </svg>
              Saving...
            </>
          ) : isEditing ? (
            'Done'
          ) : (
            'Edit mode'
          )}
        </button>
      </div>
    </div>
  )
}
