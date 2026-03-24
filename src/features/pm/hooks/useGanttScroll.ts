import { createContext, useContext, RefObject } from 'react'

const GanttScrollContext = createContext<RefObject<HTMLDivElement> | null>(null)

export const useGanttScroll = () => {
  const context = useContext(GanttScrollContext)
  if (!context) {
    throw new Error('useGanttScroll must be used within GanttScrollProvider')
  }
  return context
}

export const GanttScrollProvider = GanttScrollContext.Provider
