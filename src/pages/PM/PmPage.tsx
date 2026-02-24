//import NotionSection from '@/components/Team/NotionSection'
import { useState } from 'react'
import NotionSection from '@/components/Team/NotionSection'
import GanttChart from '@/components/PM/Gantt/GanttChart'
import AIChatWidget from '@/components/PM/AIChatWidget'
import ChatBtn from '@/assets/chat_btn.svg?react'

export default function PmPage() {
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    <div>
      <div className='py-30'>
        <NotionSection />
        <GanttChart />
        <ChatBtn
          className='cursor-pointer fixed bottom-10 right-10 w-16 h-16 hover:scale-105 transition-transform z-50'
          onClick={() => setIsChatOpen(true)}
        />
        <AIChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      </div>
    </div>
  )
}
