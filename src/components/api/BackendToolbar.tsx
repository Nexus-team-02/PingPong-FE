import Lock from '@/assets/lock.svg?react'

type ViewMode = 'LIST' | 'FLOW'

type Props = {
  viewMode: ViewMode
  isSyncing: boolean
  onSync: () => void
  onAuthorize: () => void
  onViewModeChange: (mode: ViewMode) => void
}

export default function BackendToolbar({
  viewMode,
  isSyncing,
  onSync,
  onAuthorize,
  onViewModeChange,
}: Props) {
  return (
    <div className='flex items-center justify-between mb-8'>
      <h2 className='text-xl font-bold'>{viewMode === 'LIST' ? 'ALL' : 'FLOW'}</h2>
      <div className='flex items-center gap-3'>
        <button
          onClick={onSync}
          disabled={isSyncing}
          className='cursor-pointer flex items-center gap-1.5 rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='16'
            height='16'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-500' : ''}`}
          >
            <path d='M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8' />
            <path d='M21 3v5h-5' />
          </svg>
          Sync
        </button>
        <button
          onClick={onAuthorize}
          className='cursor-pointer flex items-center gap-1 rounded-md border border-black px-2 py-1 text-sm font-medium text-black hover:bg-gray-100/50'
        >
          Authorise
          <Lock className='w-4.5 h-4.5' />
        </button>
        <div className='w-px h-5 bg-gray-300 mx-1' />
        {(['LIST', 'FLOW'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => onViewModeChange(mode)}
            className={`cursor-pointer px-3 py-1 rounded-md border text-sm transition-colors ${
              viewMode === mode
                ? 'bg-black text-white'
                : 'border-gray-400 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {mode === 'LIST' ? 'List' : 'Flow'}
          </button>
        ))}
      </div>
    </div>
  )
}
