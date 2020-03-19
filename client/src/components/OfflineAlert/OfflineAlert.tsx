import React, { useEffect, useState } from 'react'
import { Alert } from 'antd'

export default function OfflineAlert(): JSX.Element | null {
  const [isOffline, setIsOffline] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('offline', handleConnectionStatus)
    window.addEventListener('online', handleConnectionStatus)
    return () => {
      window.removeEventListener('offline', handleConnectionStatus)
      window.removeEventListener('online', handleConnectionStatus)
    }
  }, [])

  const handleConnectionStatus = () => setIsOffline(navigator.onLine ? false : true)

  if (!isOffline) return null
  return (
    <Alert banner message='Connection is lost' type='error' style={{ background: '#ffccc7' }} />
  )
}
