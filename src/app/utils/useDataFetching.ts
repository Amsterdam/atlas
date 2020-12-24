import { useState } from 'react'
import { fetchWithToken } from '../../shared/services/api/api'

function useDataFetching<T = any>() {
  const [results, setResults] = useState<T | null>(null)
  const [errorMessage, setErrorMessage] = useState(false)
  const [loading, setLoading] = useState(false)

  async function fetchData(endpoint: string) {
    setLoading(true)
    try {
      const data = await fetchWithToken(endpoint)
      setResults(data)
    } catch (e) {
      setErrorMessage(e.message)
    }

    setLoading(false)
    return results
  }

  return {
    errorMessage,
    loading,
    results,
    fetchData,
  }
}

export default useDataFetching
