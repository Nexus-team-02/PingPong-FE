import { useState, useMemo, useEffect } from 'react'
import { getFlowDetails, getRequestComment } from '@/features/flow/api'
import useApi from '@/shared/hooks/useApi'
import {
  FlowDetailResponse,
  CommentData,
  LinkedEndpoint,
  RequestComment,
} from '@/features/flow/types'

export function useFlowComments(flowId: string | undefined) {
  const {
    execute: fetchFlowDetails,
    data: flowData,
    loading: flowLoading,
  } = useApi<FlowDetailResponse>(getFlowDetails)
  const {
    execute: fetchComments,
    data: commentsData,
    loading: commentsLoading,
  } = useApi<RequestComment[]>(getRequestComment)

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [localDraftComments, setLocalDraftComments] = useState<CommentData[]>([])

  const images = flowData?.images ?? []
  const currentImage = images[currentSlideIndex]

  useEffect(() => {
    if (flowId) fetchFlowDetails(flowId)
  }, [flowId, fetchFlowDetails])

  useEffect(() => {
    if (currentImage?.imageId) {
      fetchComments(currentImage.imageId)
    }
  }, [currentImage?.imageId, fetchComments])

  const goToPrev = () => {
    setCurrentSlideIndex((i) => (i > 0 ? i - 1 : images.length - 1))
    setLocalDraftComments([])
  }
  const goToNext = () => {
    setCurrentSlideIndex((i) => (i < images.length - 1 ? i + 1 : 0))
    setLocalDraftComments([])
  }

  const serverComments: CommentData[] = useMemo(() => {
    if (!commentsData || !currentImage) return []
    return commentsData.map((c) => ({
      id: c.requestId,
      x: c.x,
      y: c.y,
      content: c.content,
      text: c.content,
      imageId: currentImage.imageId,
      endpoints: c.endpoints,
    }))
  }, [commentsData, currentImage])

  const allComments = [...serverComments, ...localDraftComments]

  const groupedApiData = useMemo(() => {
    if (!commentsData) return []
    const map = new Map<string, { tag: string; endpoints: LinkedEndpoint[] }>()
    commentsData.forEach(({ endpoints }) => {
      endpoints.forEach((ep) => {
        if (!map.has(ep.tag)) map.set(ep.tag, { tag: ep.tag, endpoints: [] })
        const group = map.get(ep.tag)!
        if (!group.endpoints.some((e) => e.endpointId === ep.endpointId)) {
          group.endpoints.push(ep)
        }
      })
    })
    return Array.from(map.values())
  }, [commentsData])

  const addDraftComment = (comment: Omit<CommentData, 'id'>) => {
    setLocalDraftComments((prev) => [...prev, { ...comment, id: Date.now() }])
  }
  const refetchComments = () => {
    if (currentImage?.imageId) fetchComments(currentImage.imageId)
  }

  return {
    flowLoading,
    commentsLoading,
    images,
    currentImage,
    allComments,
    groupedApiData,
    goToPrev,
    goToNext,
    addDraftComment,
    refetchComments,
  }
}
