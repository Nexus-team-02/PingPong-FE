interface Props {
  title: string
  subtitle: string
}

export default function AuthTitle({ title, subtitle }: Props) {
  return (
    <div className='mb-10 text-center'>
      <h1 className='text-5xl font-black font-Aquire'>{title}</h1>
      <p className='mt-2 text-xl text-black'>{subtitle}</p>
    </div>
  )
}
