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

// 이 훅을 쓰지 않는 곳(예: 영수증 스캔 후 식비 자동 등록)에서도 같은 localStorage
// 값을 갱신하고 이미 마운트된 useLocalStorage 사용처에 동기화 이벤트를 보내야 할 때 쓴다.
export function writeLocalStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }))
}

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => readValue(key, initialValue))

  useEffect(() => {
    writeLocalStorage(key, value)
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
