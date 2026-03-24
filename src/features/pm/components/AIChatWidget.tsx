import { useState, useRef, useEffect } from 'react'
import { initChatStream, connectChatStream } from '@/shared/api/chat'
import { useParams } from 'react-router-dom'
import { ChatMessage } from '@/shared/types/chat'
import ChatIcon from '@/assets/ai_chat.svg?react'
import HeaderIcon from '@/assets/ai_header.svg?react'
import SendIcon from '@/assets/ai_send.svg?react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function AIChatWidget({ isOpen, onClose }: Props) {
  const { teamId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || !teamId) return

    const userMessage = inputValue
    setMessages((prev) => [...prev, { id: Date.now(), type: 'user', text: userMessage }])
    setInputValue('')

    try {
      const streamId = await initChatStream(Number(teamId), userMessage)
      const aiMessageId = Date.now() + 1
      setMessages((prev) => [...prev, { id: aiMessageId, type: 'ai', text: '' }])

      await connectChatStream(Number(teamId), streamId, (chunk) => {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === aiMessageId ? { ...msg, text: msg.text + chunk } : msg)),
        )
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      {isOpen && (
        <div className='fixed bottom-10 right-10 w-90 h-150 bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col overflow-hidden z-50 border border-gray-100'>
          <div className='bg-linear-to-r from-[#FBEDEC] to-[#F3ADCF]  px-5 py-4 flex justify-between items-center'>
            <div className='flex items-center gap-2 font-bold text-gray-900 text-[17px]'>
              <HeaderIcon className='w-9 h-9' />
              AI Assistant
            </div>
            <button
              onClick={onClose}
              className='text-gray-800 hover:text-black transition-colors cursor-pointer'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12'></path>
              </svg>
            </button>
          </div>

          <div className='flex-1 p-5 overflow-y-auto flex flex-col gap-5 bg-white'>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start gap-3'}`}
              >
                {msg.type === 'ai' && <ChatIcon className='w-9 h-9 shrink-0' />}

                <div
                  className={`px-5 py-4 min-h-12 text-[15px] leading-relaxed wrap-break-word ${
                    msg.type === 'user'
                      ? 'bg-[#b76aa9] text-white rounded-2xl rounded-br-sm max-w-[80%]'
                      : 'bg-[#faeaee] text-gray-800 rounded-2xl rounded-tl-sm max-w-[75%]'
                  }`}
                >
                  {msg.text || (msg.type === 'ai' ? '...' : '')}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='p-4 bg-white border-t border-gray-50'>
            <form onSubmit={handleSend} className='relative flex items-center'>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='w-full border border-gray-300 rounded-full pl-5 pr-14 py-3 text-[15px] focus:outline-none focus:border-[#b76aa9] transition-colors placeholder:text-gray-400'
                placeholder='Type your message...'
              />
              <button
                type='submit'
                className='absolute right-2 w-9 h-9 rounded-full bg-[#cb7cb5] hover:bg-[#b76aa9] transition-colors flex items-center justify-center text-white'
              >
                <SendIcon className='cursor-pointer' />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
