import React from 'react'

interface FolderProps {
  imageUrl?: string
  folderName: string
  onChangeFolderName?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onClick?: () => void
}

export default function Folder({ imageUrl, folderName, onChangeFolderName, onClick }: FolderProps) {
  return (
    <div className='relative w-75 h-65 drop-shadow-lg transition-transform duration-300 group'>
      <div className='absolute top-7 right-4 w-[60%] h-4 bg-[#A3A3A3] rounded-t-[20px]'></div>
      <div className='absolute top-2 left-0 w-[45%] h-8 bg-[#FAEBCE] rounded-t-[20px] z-10'></div>

      <div className='absolute top-9.75 left-0 w-full h-[calc(100%-39px)] bg-[#FAEBCE] rounded-2xl rounded-tl-none z-20 flex flex-col overflow-hidden shadow-sm'>
        <div
          className='flex-1 px-5 pt-5 pb-4 cursor-pointer hover:opacity-90 transition-opacity max-h-43'
          onClick={onClick}
          title='Click to image upload.'
        >
          <div className='w-full h-full bg-[#E4DCC4] rounded-lg overflow-hidden flex items-center justify-center relative group-hover:bg-[#dfd5ba] transition-colors'>
            {imageUrl ? (
              <img src={imageUrl} alt='Folder thumbnail' className='w-full h-full object-cover' />
            ) : (
              <div className='flex flex-col items-center gap-1 text-black/30'>
                <span className='font-medium text-sm'>Upload Image</span>
              </div>
            )}
          </div>
        </div>

        <div className='h-12 bg-[#F1F4F8] flex items-center px-4 border-t border-black/5'>
          <input
            type='text'
            placeholder='FOLDER NAME'
            value={folderName}
            onChange={onChangeFolderName}
            readOnly={!onChangeFolderName}
            className={`w-full bg-transparent text-gray-900 font-bold tracking-wide text-sm uppercase outline-none placeholder-gray-400 transition-all px-2 py-1 ${
              !onChangeFolderName
                ? 'cursor-default'
                : 'focus:border-b-2 focus:border-blue-400 focus:pb-0.5'
            }`}
          />
        </div>
      </div>
    </div>
  )
}
