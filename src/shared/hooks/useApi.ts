import { useCallback, useState } from 'react'

export default function useApi<TData, TArgs extends unknown[] = unknown[]>(
  apiFn: (...args: TArgs) => Promise<TData>,
) {
  const [data, setData] = useState<TData | null>(null)
  const [error, setError] = useState<unknown>(null)
  const [loading, setLoading] = useState<boolean>(false)

  const execute = useCallback(
    async (...args: TArgs): Promise<TData> => {
      setLoading(true)
      setError(null)

      try {
        const res = await apiFn(...args)
        setData(res)
        return res
      } catch (err) {
        setError(err)
        throw err
      } finally {
        setLoading(false)
      }
    },
    [apiFn],
  )

  return { data, error, loading, execute }
}
