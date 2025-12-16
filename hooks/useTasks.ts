import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) {
    throw new Error('Failed to fetch')
  }
  return res.json()
})

export function useTasks(statusFilter?: string, sortBy?: string, sortOrder?: string) {
  const params = new URLSearchParams()
  
  if (statusFilter && statusFilter !== '' && statusFilter !== 'all') {
    params.append('status', statusFilter)
  }
  
  if (sortBy) {
    params.append('sortBy', sortBy)
  }
  
  if (sortOrder) {
    params.append('sortOrder', sortOrder)
  }
  
  const queryString = params.toString()
  const url = `/api/tasks${queryString ? `?${queryString}` : ''}`

  const { data, error, mutate, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    shouldRetryOnError: false,
    dedupingInterval: 2000
  })

  return {
    tasks: data || [],
    isLoading,
    isError: error,
    mutate
  }
}