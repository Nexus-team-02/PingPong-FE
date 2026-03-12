import RoleCard from '@/components/Home/RoleCard'

export default function HomePage() {
  return (
    <main className='relative overflow-hidde'>
      <section className='relative mx-auto max-w-6xl px-6 pt-25'>
        <h1 className='mb-20 text-left'>
          <span className='inline text-7xl font-extrabold tracking-tight font-Aquire'>API</span>{' '}
          <span className='inline text-7xl font-extrabold tracking-tight ml-5'> &</span>
          <span className='block text-7xl font-extrabold tracking-tight font-Aquire text-transparent [-webkit-text-stroke:2px_var(--color-gray-900)]'>
            DOCS
          </span>
        </h1>

        <div className='grid grid-cols-1 gap-[8vw] md:grid-cols-3'>
          <RoleCard title='BACKEND' description={`Start 'NEXUS'\nas a back-end developer`} />
          <RoleCard title='FRONTEND' description={`Start 'NEXUS'\nas a front-end developer`} />
          <RoleCard title='PM/QA' description={`Start 'NEXUS'\nas a designer developer`} />
        </div>
      </section>
    </main>
  )
}
