export interface ChatMessage {
  id: number
  type: 'user' | 'ai'
  text: string
}
