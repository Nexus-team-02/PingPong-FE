import { Outlet } from 'react-router-dom'
import Header from '@/shared/components/Header'
import RouteChangeLoader from '@/shared/components/RouteChangeLoader'

export default function RootLayout() {
  return (
    <>
      <RouteChangeLoader />
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  )
}
