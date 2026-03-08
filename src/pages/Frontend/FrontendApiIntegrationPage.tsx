import { useEffect, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { getFlowDetails } from '@/api/flow'
import useApi from '@/hook/useApi'
import LeftIcon from '@/assets/left.svg?react'
import RightIcon from '@/assets/right.svg?react'

const MOCK_API_LIST = [
  {
    category: 'LOGIN',
    endpoints: [
      { method: 'GET', path: '/login', title: 'Strat Login', isUpdate: true },
      { method: 'GET', path: '/login', title: 'Strat Login' },
    ],
  },
  {
    category: 'SIGNUP',
    endpoints: [{ method: 'POST', path: '/signup' }],
  },
]

interface FlowImage {
  imageId: number
  imageUrl: string
}

interface FlowDetailResponse {
  flowId: number
  title: string
  description: string
  images: FlowImage[]
}
// ---------------------------------------------

interface TeamLayoutContext {
  setDynamicTitle: (title: string | null) => void
  setDynamicSubtitle: (subtitle: string | null) => void
}

interface LocationState {
  title?: string
  subtitle?: string
}

const getMethodStyles = (method: string) => {
  switch (method) {
    case 'GET':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-600',
        badge: 'bg-blue-400',
      }
    case 'POST':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-600',
        badge: 'bg-green-400',
      }
    case 'PUT':
      return {
        bg: 'bg-orange-50',
        border: 'border-orange-200',
        text: 'text-orange-600',
        badge: 'bg-orange-400',
      }
    case 'DELETE':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-600',
        badge: 'bg-red-400',
      }
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-600',
        badge: 'bg-gray-400',
      }
  }
}

export default function FrontendApiIntegrationPage() {
  const location = useLocation()
  const { flowId } = useParams()
  const { setDynamicTitle, setDynamicSubtitle } = useOutletContext<TeamLayoutContext>()

  const { execute, data, loading } = useApi<FlowDetailResponse>(getFlowDetails)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)

  const images = data?.images || []
  const currentImage = images[currentSlideIndex]

  useEffect(() => {
    const state = location.state as LocationState | null
    if (state?.title) setDynamicTitle(state.title)
    if (state?.subtitle) setDynamicSubtitle(state.subtitle)

    if (flowId) {
      execute(flowId)
    }

    return () => {
      setDynamicTitle(null)
      setDynamicSubtitle(null)
    }
  }, [location.state, setDynamicTitle, setDynamicSubtitle, execute, flowId])

  // 슬라이드 핸들러 (images.length를 기준으로 작동하도록 수정)
  const handlePrevSlide = () => {
    if (images.length === 0) return
    setCurrentSlideIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNextSlide = () => {
    if (images.length === 0) return
    setCurrentSlideIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  // 로딩 상태 처리
  if (loading) {
    return <div className='min-h-screen flex items-center justify-center'>Loading...</div>
  }

  return (
    <div className='min-h-screen p-10 z-20 flex flex-col items-center'>
      {/* 1. 이미지 슬라이더 영역 */}
      <div className='w-full max-w-5xl flex items-center justify-between mb-16 mt-10'>
        <LeftIcon
          onClick={handlePrevSlide}
          className='cursor-pointer w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition'
        >
          &#10094;
        </LeftIcon>

        <div className='w-150 h-87.5 bg-white rounded-2xl shadow-lg overflow-hidden flex items-center justify-center'>
          {/* 이미지가 있을 때만 렌더링 */}
          {currentImage ? (
            <img
              src={currentImage.imageUrl}
              alt={`Slide ID: ${currentImage.imageId}`}
              data-image-id={currentImage.imageId}
              className='w-full h-full object-cover'
            />
          ) : (
            <div className='text-gray-400'>이미지가 없습니다.</div>
          )}
        </div>

        <RightIcon
          onClick={handleNextSlide}
          className='cursor-pointer w-12 h-12 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800 transition'
        >
          &#10095;
        </RightIcon>
      </div>

      {/* 2. 하단 API 리스트 영역 */}
      {/* 현재 이미지(currentImage.imageId)에 따라 API 리스트가 달라져야 한다면, 이 부분에서 currentImage.imageId를 기반으로 데이터를 필터링하거나 새로 불러오도록 처리해야 합니다. */}
      <div className='w-full max-w-4xl bg-white mx-auto flex flex-col gap-10'>
        {MOCK_API_LIST.map((group, groupIdx) => (
          <div key={groupIdx} className='flex flex-col gap-4'>
            <h3 className='font-bold text-lg border-b-2 border-gray-200 pb-2'>{group.category}</h3>

            <div className='flex flex-col gap-3'>
              {group.endpoints.map((api, apiIdx) => {
                const styles = getMethodStyles(api.method)
                return (
                  <div key={apiIdx} className='flex items-center gap-3'>
                    <div
                      className={`flex-1 flex items-center justify-between p-3 rounded-lg border ${styles.bg} ${styles.border}`}
                    >
                      <div className='flex items-center gap-4'>
                        <span
                          className={`px-4 py-1 rounded text-white font-bold text-sm ${styles.badge}`}
                        >
                          {api.method}
                        </span>
                        <div className='flex items-center gap-2'>
                          <span className='font-semibold text-gray-800'>{api.path}</span>
                          {api.title && <span className='text-gray-400 text-sm'>{api.title}</span>}
                          {api.isUpdate && (
                            <span className='px-2 py-0.5 bg-green-400 text-white text-[10px] rounded-full font-bold ml-2'>
                              UPDATE
                            </span>
                          )}
                        </div>
                      </div>
                      <button className={`p-1 ${styles.text}`}>&#x2303;</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
