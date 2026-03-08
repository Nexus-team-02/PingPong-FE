import { HttpMethod } from '@/types/api'

export const METHOD_STYLE: Record<
  HttpMethod,
  { bg: string; border: string; text: string; badge: string }
> = {
  GET: {
    bg: 'bg-api-blue-sub',
    border: 'border-api-blue',
    text: 'text-api-blue',
    badge: 'bg-api-blue',
  },
  POST: {
    bg: 'bg-api-green-sub',
    border: 'border-api-green',
    text: 'text-api-green',
    badge: 'bg-api-green',
  },
  PUT: {
    bg: 'bg-api-yellow-sub',
    border: 'border-api-yellow',
    text: 'text-api-yellow',
    badge: 'bg-api-yellow',
  },
  DELETE: {
    bg: 'bg-api-red-sub',
    border: 'border-api-red',
    text: 'text-api-red',
    badge: 'bg-api-red',
  },
  PATCH: {
    bg: 'bg-[#EFF8F5]',
    border: 'border-[#8BE0C4]',
    text: 'text-[#8BE0C4]',
    badge: 'bg-[#8BE0C4]',
  },
}
