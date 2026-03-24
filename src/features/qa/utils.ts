import type { HttpMethod } from './types'

export const METHOD_STYLE: Record<
  HttpMethod,
  { badge: string; text: string; border: string; bg: string }
> = {
  GET: {
    badge: 'bg-api-blue text-white',
    text: 'text-[#3ecf7a]',
    border: 'border-[#3ecf7a]/30',
    bg: 'bg-[#3ecf7a]/5',
  },
  POST: {
    badge: 'bg-api-green text-white',
    text: 'text-[#4fa8e8]',
    border: 'border-[#4fa8e8]/30',
    bg: 'bg-[#4fa8e8]/5',
  },
  PUT: {
    badge: 'bg-api-yellow text-white',
    text: 'text-[#f5a623]',
    border: 'border-[#f5a623]/30',
    bg: 'bg-[#f5a623]/5',
  },
  DELETE: {
    badge: 'bg-api-red text-white',
    text: 'text-[#e85454]',
    border: 'border-[#e85454]/30',
    bg: 'bg-[#e85454]/5',
  },
  PATCH: {
    badge: 'bg-[#8BE0C4] text-white',
    text: 'text-[#9b7fe8]',
    border: 'border-[#9b7fe8]/30',
    bg: 'bg-[#9b7fe8]/5',
  },
}

export function successRateColor(rate: number) {
  if (rate >= 0.8) return 'bg-[#3ecf7a]'
  if (rate >= 0.5) return 'bg-[#f5a623]'
  return 'bg-[#e85454]'
}

export function formatBody(body: string) {
  try {
    return JSON.stringify(JSON.parse(body), null, 2)
  } catch {
    return body
  }
}

/** 값이 객체일 경우 JSON으로 직렬화, 아니면 문자열로 변환 */
export function safeString(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value)
}

/** responseBody 파싱 (이미 객체로 들어올 경우도 방어) */
export function parseResponseBody(body: unknown): string {
  if (!body) return ''
  if (typeof body === 'object') return JSON.stringify(body, null, 2)
  try {
    return JSON.stringify(JSON.parse(body as string), null, 2)
  } catch {
    return String(body)
  }
}
