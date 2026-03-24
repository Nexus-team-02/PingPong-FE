import LinkItem from './LinkItem'
import Title from '@/shared/components/Title'

import SwaggerIcon from '@/assets/swagger.svg?react'
import FigmaIcon from '@/assets/figma.svg?react'
import DiscordIcon from '@/assets/discord.svg?react'
import GithubIcon from '@/assets/github.svg?react'

interface Props {
  figma: string
  discord: string
  swagger: string
  github: string
  onChange: (key: 'figma' | 'discord' | 'swagger' | 'github', value: string) => void
}

export default function LinkSection({ figma, discord, swagger, github, onChange }: Props) {
  return (
    <section className='rounded-xl border border-black/10 bg-white/60 px-6 py-8'>
      <Title size='md'>LINKS</Title>

      <div className='grid grid-cols-2 gap-x-5 gap-y-4'>
        <LinkItem
          label='Swagger'
          value={swagger}
          placeholder='https://swagger.io/...'
          icon={<SwaggerIcon className='w-5 h-5 text-black/70' />}
          onChange={(value) => onChange('swagger', value)}
        />

        <LinkItem
          label='Figma'
          value={figma}
          placeholder='https://figma.com/...'
          icon={<FigmaIcon className='w-5 h-5 text-black/70' />}
          onChange={(value) => onChange('figma', value)}
        />

        <LinkItem
          label='Discord'
          value={discord}
          placeholder='https://discord.gg/...'
          icon={<DiscordIcon className='w-5 h-5 text-black/70' />}
          onChange={(value) => onChange('discord', value)}
        />

        <LinkItem
          label='GitHub'
          value={github}
          placeholder='https://github.com/...'
          icon={<GithubIcon className='w-5 h-5 text-black/70' />}
          onChange={(value) => onChange('github', value)}
        />
      </div>
    </section>
  )
}
