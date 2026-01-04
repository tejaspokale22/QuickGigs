'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Briefcase,
  CheckCircle,
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  ArrowRight,
} from 'lucide-react'
import LeftSidebar from '@/components/LeftSidebar'
import Spinner from '@/components/ui/spinner'
import { auth } from '@/utils/firebase'

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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    )
  }

  const stats = [
    {
      label: 'Active Gigs',
      value: '0',
      icon: Briefcase,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Completed',
      value: '0',
      icon: CheckCircle,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Earnings',
      value: '$0',
      icon: DollarSign,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Success Rate',
      value: '0%',
      icon: TrendingUp,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
  ]

  const quickActions = [
    {
      title: 'Browse Gigs',
      description: 'Discover new opportunities',
      href: '/gigs',
      icon: Briefcase,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      title: 'View Profile',
      description: 'Update your information',
      href: '/profile',
      icon: Star,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
  ]

  return (
    <div className="flex w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-64 fixed left-0 h-full pt-16 border-r border-gray-200 bg-white shadow-sm">
        <LeftSidebar />
      </div>

      <main className="flex-1 ml-64 p-8 pt-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back!
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your gigs today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${stat.bgColor} p-3 rounded-lg`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mb-1 font-medium">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              )
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Recent Activity
                </h2>
                <Link
                  href="/gigs"
                  className="text-sm text-gray-900 hover:text-black font-semibold flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
                >
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="flex flex-col items-center justify-center py-12">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-center mb-4 font-medium">
                  No recent activity yet
                </p>
                <Link href="/gigs">
                  <button className="bg-black text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm cursor-pointer">
                    Browse Available Gigs
                  </button>
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  {quickActions.map((action, index) => {
                    const Icon = action.icon
                    return (
                      <Link key={index} href={action.href} className="block">
                        <div
                          className="group p-4 rounded-lg border border-gray-200
          hover:border-gray-400 hover:shadow-md transition-all
          cursor-pointer bg-gray-50/50 hover:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`${action.bgColor} p-2 rounded-lg`}>
                              <Icon className={`w-5 h-5 ${action.color}`} />
                            </div>

                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 text-sm">
                                {action.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                {action.description}
                              </p>
                            </div>

                            <ArrowRight
                              className="w-4 h-4 text-gray-400
              group-hover:text-gray-700
              group-hover:translate-x-1 transition-all"
                            />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl p-6 shadow-lg text-white border border-gray-700">
                <h3 className="text-lg font-bold mb-2">Start Your Journey</h3>
                <p className="text-gray-300 text-sm mb-4">
                  Apply to your first gig and start earning today!
                </p>
                <Link href="/gigs">
                  <button className="w-full bg-white text-gray-900 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                    Explore Opportunities
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
