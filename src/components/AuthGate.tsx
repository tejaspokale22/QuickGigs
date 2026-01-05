'use client'

import { useAuth } from '@/context/AuthContext'
import AppLoader from '@/components/AppLoader'

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()

  if (loading) {
    return <AppLoader />
  }

  return <>{children}</>
}
