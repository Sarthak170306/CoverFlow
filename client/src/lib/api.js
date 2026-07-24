import axios from 'axios'
import { useAuth } from '@clerk/clerk-react'
import { useMemo } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

/**
 * Custom hook to get an Axios instance with automatic Clerk session token injection
 */
export function useApiClient() {
  const { getToken } = useAuth()

  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    instance.interceptors.request.use(async (config) => {
      try {
        const token = await getToken()
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      } catch (err) {
        console.warn('Could not retrieve Clerk auth token for request', err)
      }
      return config
    })

    return instance
  }, [getToken])

  return api
}

export default useApiClient
