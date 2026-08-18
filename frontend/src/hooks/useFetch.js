import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

function useFetch(url, params = {}, options = {}) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await api.get(url, { params })
      setData(response)
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred')
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }, [url, JSON.stringify(params)])

  useEffect(() => {
    if (options.skip) return
    fetchData()
  }, [fetchData, options.skip])

  const refetch = () => {
    fetchData()
  }

  return { data, isLoading, error, refetch }
}

export default useFetch