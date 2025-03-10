'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/LeftSidebar'
import { auth } from '@/app/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'

const DashboardPage = () => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false)
      if (!user) {
        router.push('/login')
      }
    })

    return () => unsubscribe()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="flex w-full min-h-screen bg-gray-50 pt-16">
      {/* Left Sidebar */}
      <div className="w-64 fixed left-0 h-full">
        <LeftSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Redirect to /gigs by default */}
          {typeof window !== 'undefined' && window.location.pathname === '/dashboard' && (
            <>{router.push('/gigs')}</>
          )}
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
