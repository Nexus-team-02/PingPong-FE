import { useState, useRef, useEffect } from 'react'
import { initChatStream, connectChatStream } from '@/shared/api/chat'
import { useParams } from 'react-router-dom'
import { ChatMessage } from '@/shared/types/chat'
import ChatIcon from '@/assets/ai_chat.svg?react'
import HeaderIcon from '@/assets/ai_header.svg?react'
import SendIcon from '@/assets/ai_send.svg?react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Props {
  isOpen: boolean
  onClose: () => void
  suggestions?: string[]
}

function LoadingDots() {
  return (
    <div className='flex items-center gap-1 h-5 px-1'>
      <span className='animate-bounce-dot anim-delay-[0s]   w-2 h-2 rounded-full bg-[#c07ab4] inline-block' />
      <span className='animate-bounce-dot anim-delay-[0.2s] w-2 h-2 rounded-full bg-[#c07ab4] inline-block' />
      <span className='animate-bounce-dot anim-delay-[0.4s] w-2 h-2 rounded-full bg-[#c07ab4] inline-block' />
    </div>
  )
}

export default function AIChatWidget({ isOpen, onClose, suggestions = [] }: Props) {
  const { teamId } = useParams()
  const [inputValue, setInputValue] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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

  const showSuggestions = suggestions.length > 0 && messages.length === 0

  return (
    <>
      {isOpen && (
        <div className='fixed bottom-10 right-10 w-90 h-150 bg-white rounded-2xl shadow-[0_12px_40px_rgba(180,100,160,0.15),0_2px_8px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden z-50 border border-[#f0e0eb]'>
          <div className='bg-linear-to-r from-[#fceef0] to-[#f5b8d8] px-5 py-4 flex justify-between items-center border-b border-[#f0d0e4]/60'>
            <div className='flex items-center gap-2.5 font-bold text-gray-800 text-[16px] tracking-tight'>
              <HeaderIcon className='w-8 h-8' />
              AI Assistant
            </div>
            <button
              onClick={onClose}
              className='w-7 h-7 flex items-center justify-center rounded-full text-[#9a6090] hover:bg-[#eed8e8] hover:text-[#6b3a64] transition-all cursor-pointer'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                strokeWidth='2.5'
                viewBox='0 0 24 24'
              >
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

          <div className='flex-1 px-4 py-5 overflow-y-auto flex flex-col gap-4 bg-[#fdfafc] scrollbar-hide'>
            {/* Suggestion chips */}
            {showSuggestions && (
              <div className='flex flex-col gap-2 mt-auto'>
                <p className='text-[11px] font-semibold text-[#c09ab8] uppercase tracking-widest px-1 mb-0.5'>
                  무엇이 궁금하세요?
                </p>
                {suggestions.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => setInputValue(text)}
                    style={{ animationDelay: `${0.06 + i * 0.07}s` }}
                    className='animate-chip-in text-left text-[13px] text-[#7a3b70] bg-white hover:bg-[#fdf0f8] border border-[#eacfe0] hover:border-[#d4a8c8] rounded-xl px-4 py-2.5 leading-snug transition-all shadow-[0_1px_3px_rgba(180,100,160,0.08)] cursor-pointer'
                  >
                    <span className='mr-2 opacity-40 text-[11px]'>✦</span>
                    {text}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start items-end gap-2'}`}
              >
                {msg.type === 'ai' && <ChatIcon className='w-8 h-8 shrink-0 mb-0.5' />}

                <div
                  className={`px-4 py-3.5 min-h-11 text-[14.5px] leading-relaxed wrap-break-word ${
                    msg.type === 'user'
                      ? 'bg-[#c07ab4] text-white rounded-2xl rounded-br-md max-w-[80%] shadow-[0_2px_8px_rgba(180,100,160,0.25)]'
                      : 'bg-white border border-[#f0dcea] text-gray-700 rounded-2xl rounded-tl-md max-w-[78%] shadow-[0_1px_4px_rgba(0,0,0,0.05)]'
                  }`}
                >
                  {msg.type === 'ai' ? (
                    msg.text ? (
                      <div className='ai-markdown'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                      </div>
                    ) : (
                      <LoadingDots />
                    )
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className='px-4 py-3.5 bg-white border-t border-[#f5eaf2]'>
            <form onSubmit={handleSend} className='relative flex items-center'>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='w-full border border-[#e0ceda] bg-[#fdf7fb] rounded-full pl-5 pr-12 py-2.5 text-[14px] text-gray-700 focus:outline-none focus:border-[#c07ab4] focus:bg-white transition-all placeholder:text-[#c8a8c0]'
                placeholder='메시지를 입력하세요...'
              />
              <button
                type='submit'
                className='absolute right-1.5 w-8 h-8 rounded-full bg-[#c07ab4] hover:bg-[#a96099] active:scale-95 transition-all flex items-center justify-center text-white shadow-[0_2px_6px_rgba(180,100,160,0.35)] cursor-pointer'
              >
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
