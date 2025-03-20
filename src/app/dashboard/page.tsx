'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import LeftSidebar from '@/components/LeftSidebar'
import { auth } from '@/app/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  }

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="flex w-full min-h-screen bg-gray-50"
    >
      {/* Left Sidebar with animation */}
      <motion.div
        variants={childVariants}
        className="w-64 fixed left-0 h-full pt-16 border-r border-gray-200 bg-white shadow-sm"
      >
        <LeftSidebar />
      </motion.div>

      {/* Main Content Area */}
      <motion.main
        variants={childVariants}
        className="flex-1 ml-64 p-6 pt-20"
      >
        <motion.div
          variants={childVariants}
          className="max-w-7xl mx-auto"
        >
          {/* Welcome Section */}
          <motion.div
            variants={childVariants}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          >
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to your Dashboard
            </h1>
            <p className="text-gray-600">
              Find and manage your gigs all in one place. Get started by exploring available opportunities.
            </p>
          </motion.div>

          {/* Quick Stats Section */}
          <motion.div
            variants={childVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            {['Active Gigs', 'Completed Gigs', 'Earnings'].map((stat, index) => (
              <motion.div
                key={stat}
                variants={childVariants}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
              >
                <h3 className="text-gray-500 text-sm font-medium">{stat}</h3>
                <p className="text-2xl font-bold mt-2">0</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Redirect to /gigs by default */}
          {/* {typeof window !== 'undefined' && window.location.pathname === '/dashboard' && ( */}
            {/* // <>{router.push('/gigs')}</> */}
          {/* )} */}
        </motion.div>
      </motion.main>
    </motion.div>
  )
}

export default DashboardPage
