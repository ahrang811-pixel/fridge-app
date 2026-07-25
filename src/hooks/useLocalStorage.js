import { useEffect, useState } from 'react'

const SYNC_EVENT = 'fridge-local-storage'

function readValue(key, initialValue) {
  try {
    const stored = window.localStorage.getItem(key)
    return stored ? JSON.parse(stored) : initialValue
  } catch {
    return initialValue
  }
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue))

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))
  }, [key, value])

  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail.key !== key) return
      setValue(readValue(key, initialValue))
    }
    window.addEventListener(SYNC_EVENT, handleSync)
    return () => window.removeEventListener(SYNC_EVENT, handleSync)
  }, [key])

  return [value, setValue]
}
