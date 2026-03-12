import { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import useApi from '@/hook/useApi'
import { exchangeNotionToken } from '@/api/notion'
import Spinner from '@/components/common/Spinner'

export default function NotionCallback() {
  const { execute } = useApi(exchangeNotionToken)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const code = searchParams.get('code')
  const state = searchParams.get('state')

  useEffect(() => {
    if (!code || !state) return

    const run = async () => {
      try {
        const decoded = decodeURIComponent(state)
        const { teamId } = JSON.parse(decoded)
        await execute(teamId, code)
        navigate(`/team/${teamId}/pm`, { replace: true })
      } catch (e) {
        console.error(e)
      }
    }

    run()
  }, [code, state, execute, navigate])

  return <Spinner />
}
