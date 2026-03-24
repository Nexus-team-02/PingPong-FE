import { useState, useEffect, useCallback } from 'react'
import { Page } from '@/features/pm/types/gantt'
import useApi from '@/shared/hooks/useApi'
import { getPrimaryDatabase, updatePage, createPrimaryPage } from '@/features/pm/api'

export function useGanttTasks(teamId: number) {
  const [pages, setPages] = useState<Page[]>([])

  const { execute, loading, error } = useApi(getPrimaryDatabase)
  const { execute: executeUpdate } = useApi(updatePage)
  const { execute: executeCreate } = useApi(createPrimaryPage)

  useEffect(() => {
    if (!teamId) return
    const fetchTasks = async () => {
      try {
        const result = await execute(teamId)
        if (!result?.pages) return

        const initializedPages = result.pages.map((page: Page) => ({
          ...page,
          originalDate: page.date,
          originalCompletedDate: page.completedDate,
          originalTitle: page.title,
          originalStatus: page.status,
        }))
        setPages(initializedPages)
      } catch (err) {
        console.error('Failed to fetch tasks:', err)
      }
    }
    fetchTasks()
  }, [teamId, execute])

  const updateTask = useCallback((updatedPage: Page) => {
    setPages((prev) => prev.map((p) => (p.id === updatedPage.id ? updatedPage : p)))
  }, [])

  const addTask = useCallback(() => {
    setPages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        url: '',
        title: '',
        status: '진행 중',
        isNew: true,
      },
    ])
  }, [])

  const saveAll = async () => {
    if (!teamId) return false
    try {
      const createTargets = pages.filter((p) => p.isNew)
      const updateTargets = pages.filter(
        (p) =>
          !p.isNew &&
          (p.title !== p.originalTitle ||
            p.status !== p.originalStatus ||
            JSON.stringify(p.date) !== JSON.stringify(p.originalDate) ||
            JSON.stringify(p.completedDate) !== JSON.stringify(p.originalCompletedDate)),
      )

      const createRequests = createTargets.map((p) =>
        executeCreate(teamId, {
          title: p.title,
          status: p.status,
          date: p.date,
          completedDate: p.completedDate,
        }),
      )
      const updateRequests = updateTargets.map((p) =>
        executeUpdate(teamId, p.id, {
          title: p.title,
          status: p.status,
          date: p.date,
          completedDate: p.completedDate,
        }),
      )

      await Promise.all([...createRequests, ...updateRequests])

      setPages((prev) =>
        prev.map((p) => ({
          ...p,
          originalTitle: p.title,
          originalStatus: p.status,
          originalDate: p.date,
          originalCompletedDate: p.completedDate,
          isNew: false,
        })),
      )
      return true
    } catch (err) {
      console.error('Save failed:', err)
      alert('저장 중 오류가 발생했습니다.')
      return false
    }
  }

  return { pages, loading, error, addTask, updateTask, saveAll }
}
