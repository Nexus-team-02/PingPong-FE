import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import useApi from '@/hook/useApi'
import { linkEndpointsToRequest } from '@/api/flow'
import { getAllEndpoints } from '@/api/swagger'
import { LinkedEndpoint } from '@/types/flow'
import Modal from '@/components/common/Modal'
import Spinner from '../common/Spinner'
import { toast } from 'sonner'

interface ApiLinkModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: number | null
  onSuccess: () => void
}

export default function ApiLinkModal({ isOpen, onClose, requestId, onSuccess }: ApiLinkModalProps) {
  const { teamId } = useParams()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const {
    execute: fetchEndpoints,
    data: endpoints,
    loading: isFetching,
  } = useApi<LinkedEndpoint[]>(getAllEndpoints)
  const { execute: linkEndpoints, loading: isLinking } = useApi(linkEndpointsToRequest)

  useEffect(() => {
    if (isOpen && teamId) {
      fetchEndpoints(teamId)
    }
  }, [isOpen, teamId, fetchEndpoints])

  const handleCloseModal = () => {
    setSearchTerm('')
    setSelectedIds([])
    onClose()
  }

  const filteredEndpoints = useMemo(() => {
    if (!endpoints) return []
    if (!searchTerm) return endpoints

    const lowerKeyword = searchTerm.toLowerCase()
    return endpoints.filter(
      (ep) =>
        ep.path.toLowerCase().includes(lowerKeyword) ||
        ep.summary.toLowerCase().includes(lowerKeyword) ||
        ep.tag.toLowerCase().includes(lowerKeyword),
    )
  }, [endpoints, searchTerm])

  const toggleSelection = (endpointId: number) => {
    setSelectedIds((prev) =>
      prev.includes(endpointId) ? prev.filter((id) => id !== endpointId) : [...prev, endpointId],
    )
  }

  const handleLinkSubmit = async () => {
    if (!requestId || selectedIds.length === 0) return
    try {
      await linkEndpoints(requestId, { endpointIds: selectedIds })
      toast.success('API connected successfully.')
      onSuccess()
      handleCloseModal()
    } catch {
      // handleApiError에서 이미 toast.error() 처리됨
    }
  }

  if (!isOpen) return null

  const getMethodColor = (method: string) => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'text-api-blue'
      case 'POST':
        return 'text-api-green'
      case 'PUT':
        return 'text-api-yellow'
      case 'DELETE':
        return 'text-api-red'
      default:
        return 'text-[#8BE0C4]'
    }
  }

  return (
    <Modal title='API 연동하기' size='2xl' onClose={handleCloseModal}>
      <div className='flex flex-col max-h-[60vh]'>
        <input
          type='text'
          placeholder='API 경로, 요약, 태그 검색...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-full border border-gray-300 rounded-lg p-2 mb-4 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all'
        />

        <div className='flex-1 overflow-y-auto border border-gray-200 rounded-lg p-2 min-h-62.5 custom-scrollbar'>
          {isFetching ? (
            <Spinner />
          ) : filteredEndpoints.length > 0 ? (
            <ul className='flex flex-col gap-2'>
              {filteredEndpoints.map((ep) => (
                <li
                  key={ep.endpointId}
                  className='flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-200 transition'
                  onClick={() => toggleSelection(ep.endpointId)}
                >
                  <input
                    type='checkbox'
                    checked={selectedIds.includes(ep.endpointId)}
                    readOnly
                    className='w-5 h-5 cursor-pointer accent-blue-600'
                  />
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className={`font-bold text-sm ${getMethodColor(ep.method)}`}>
                        {ep.method}
                      </span>
                      <span className='font-mono text-sm text-gray-800'>{ep.path}</span>
                    </div>
                    <div className='text-xs text-gray-500 mt-1'>
                      [{ep.tag}] {ep.summary}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className='text-center py-10 text-gray-500'>검색된 API가 없습니다.</div>
          )}
        </div>

        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={handleCloseModal}
            className='px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium transition'
          >
            취소
          </button>
          <button
            onClick={handleLinkSubmit}
            disabled={isLinking || selectedIds.length === 0}
            className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition'
          >
            {isLinking ? '연동 중...' : `${selectedIds.length}개 연동하기`}
          </button>
        </div>
      </div>
    </Modal>
  )
}
