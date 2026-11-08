import { useEffect } from 'react'

export function useTitle(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | Excellence Finance` : 'Excellence Finance | Independent loan advice in India'
    if (description) {
      document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    }
  }, [title, description])
}
