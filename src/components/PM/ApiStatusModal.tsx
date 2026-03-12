import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Modal from '../common/Modal'
import useApi from '@/hook/useApi'
import Spinner from '../common/Spinner'
import { getPageDetail } from '@/api/notion'

interface NotionPage {
  id: string
  title: string
  status: string
  url: string
}

interface ApiStatusModalProps {
  isOpen: boolean
  onClose: () => void
  pageId: string
}

export default function ApiStatusModal({ isOpen, onClose, pageId }: ApiStatusModalProps) {
  const [apiList, setApiList] = useState<NotionPage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const { execute } = useApi(getPageDetail)
  const { teamId } = useParams<{ teamId: string }>()

  useEffect(() => {
    if (!isOpen || !teamId) return

    const fetchApiStatus = async () => {
      setIsLoading(true)
      try {
        const result = await execute(Number(teamId), pageId)

        const pages: NotionPage[] =
          result?.childDatabases?.flatMap((db) =>
            db.pages.map((page) => ({
              id: page.id,
              title: page.title,
              status: page.status,
              url: page.url,
            })),
          ) ?? []

        setApiList(pages)
      } catch (error) {
        console.error('API 상태를 불러오는 데 실패했습니다.', error)
        setApiList([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchApiStatus()
  }, [isOpen, teamId, pageId, execute])

  if (!isOpen) return null

  const getStatusColor = (status: string) => {
    const lower = status.toLowerCase()

    if (lower.includes('error') || lower.includes('offline') || lower.includes('fail')) {
      return 'red'
    }
    return 'green'
  }

  const TOTAL_ROWS = 10
  const emptyRowsCount = Math.max(0, TOTAL_ROWS - apiList.length)

  return (
    <Modal title='API Status Overview' bg='bg-white' onClose={onClose}>
      <div className='w-full'>
        <div className='flex justify-between pb-3 border-b border-gray-100 text-[13px] font-semibold text-gray-400'>
          <span>API LIST</span>
          <span>STATUS</span>
        </div>

        <div className='min-h-80'>
          {isLoading ? (
            <Spinner />
          ) : (
            <ul className='flex flex-col'>
              {apiList.map((api) => {
                const color = getStatusColor(api.status)

                return (
                  <li
                    key={api.id}
                    className='flex items-center justify-between py-3.5 border-b border-gray-100 text-[14px]'
                  >
                    <span className='text-gray-900 truncate max-w-[70%]'>{api.title}</span>

                    <div className='flex items-center gap-1.5'>
                      <div
                        className={`w-3.5 h-3.5 rounded-full shadow-sm border ${
                          color === 'red'
                            ? 'bg-linear-to-br from-red-400 to-red-600 border-red-700/20'
                            : 'bg-linear-to-br from-green-400 to-green-600 border-green-700/20'
                        }`}
                      />
                      <span className='text-gray-900'>{api.status}</span>
                    </div>
                  </li>
                )
              })}

              {[...Array(emptyRowsCount)].map((_, index) => (
                <li
                  key={`empty-${index}`}
                  className='py-3.5 border-b border-gray-100 h-10 last:border-0'
                />
              ))}
            </ul>
          )}
        </div>
      </div>
    </Modal>
  )
}
