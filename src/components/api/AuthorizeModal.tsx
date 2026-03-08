import { useState } from 'react'
import Modal from '../common/Modal'
import Lock from '@/assets/lock.svg?react'
import { useApiAuthStore } from '../../stores/apiAuthStore'

interface AuthorizeModalProps {
  onClose: () => void
}

export default function AuthorizeModal({ onClose }: AuthorizeModalProps) {
  const [token, setTokenInput] = useState('')
  const setToken = useApiAuthStore((s) => s.setToken)

  const handleSubmit = () => {
    if (!token.trim()) return
    setToken(token)
    onClose()
  }

  return (
    <Modal title='Available authorizations' size='md' onClose={onClose} bg='bg-back'>
      <div className='space-y-6'>
        <div>
          <p className='text-sm font-medium text-gray-800'>bearerAuth (http, Bearer)</p>

          <div className='mt-4'>
            <label className='block text-sm text-gray-700 mb-1'>Value :</label>

            <input
              type='text'
              placeholder='input'
              value={token}
              onChange={(e) => setTokenInput(e.target.value)}
              className='w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-api-green'
            />
          </div>
        </div>

        <div className='flex justify-end gap-3'>
          <button
            onClick={handleSubmit}
            className='cursor-pointer flex items-center gap-2 rounded-md border border-api-green px-4 py-2 text-sm font-medium text-api-green hover:bg-api-green-sub'
          >
            <Lock className='w-4 h-4 text-api-green' />
            Authorise
          </button>

          <button
            onClick={onClose}
            className='cursor-pointer rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  )
}
