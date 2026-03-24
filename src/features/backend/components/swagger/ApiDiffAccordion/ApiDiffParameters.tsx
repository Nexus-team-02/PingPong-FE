import { DiffItem, ApiParameter, HttpMethod } from '@/features/backend/types/swagger'
import Section from '../ApiAccordion/Section'

const DIFF_ROW_STYLE = {
  ADDED: 'bg-green-50 border-l-4 border-green-400',
  DELETED: 'bg-red-50 border-l-4 border-red-400 opacity-75',
  MODIFIED: 'bg-amber-50 border-l-4 border-amber-400',
  UNCHANGED: 'border-l-4 border-transparent',
} as const

const DIFF_PREFIX = {
  ADDED: { char: '+', color: 'text-green-500' },
  DELETED: { char: '-', color: 'text-red-400' },
  MODIFIED: { char: '~', color: 'text-amber-500' },
  UNCHANGED: { char: ' ', color: 'text-transparent' },
} as const

interface ParamRowProps {
  param: ApiParameter
  diffType: keyof typeof DIFF_ROW_STYLE
}

function ParamRow({ param, diffType }: ParamRowProps) {
  const { char, color } = DIFF_PREFIX[diffType]
  return (
    <div
      className={`grid grid-cols-4 gap-4 text-sm px-1 py-0.5 rounded ${DIFF_ROW_STYLE[diffType]}`}
    >
      <div className='col-span-1 wrap-break-word'>
        <div className='font-semibold text-gray-900 flex items-baseline gap-1'>
          <span className={`font-mono font-bold text-xs select-none ${color}`}>{char}</span>
          {param.name}
          {param.required && <span className='ml-1 text-red-500'>*</span>}
        </div>
        <div className='mt-1 text-xs text-gray-500'>{param.type}</div>
        <div className='text-xs italic text-gray-400'>({param.in})</div>
      </div>
      <div className='col-span-3 text-gray-700'>
        {param.description || <span className='text-gray-400'>-</span>}
      </div>
    </div>
  )
}

interface Props {
  parameters: DiffItem<ApiParameter>[]
  method: HttpMethod
}

export default function ApiDiffParameters({ parameters, method }: Props) {
  if (!parameters?.length) return null

  return (
    <Section title='Parameters' method={method}>
      <div className='space-y-4'>
        <div className='grid grid-cols-4 gap-4 border-b pb-2 text-xs font-semibold text-gray-500'>
          <div className='col-span-1'>Name</div>
          <div className='col-span-3'>Description</div>
        </div>

        <div className='space-y-4'>
          {parameters.map((item, i) => {
            if (item.diffType === 'MODIFIED') {
              return (
                <div key={i} className='space-y-1'>
                  {item.before && <ParamRow param={item.before} diffType='DELETED' />}
                  {item.after && <ParamRow param={item.after} diffType='ADDED' />}
                </div>
              )
            }
            const param = item.after ?? item.before
            return param ? <ParamRow key={i} param={param} diffType={item.diffType} /> : null
          })}
        </div>
      </div>
    </Section>
  )
}
