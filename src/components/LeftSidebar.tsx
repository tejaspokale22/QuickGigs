'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CalendarCheck,
  Upload,
  FileText,
  CheckCircle,
  MessageSquareMore,
  CreditCard,
  Plus,
  Menu,
  X,
} from 'lucide-react'
import { auth } from '@/app/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import GigForm from './GigForm'

const LeftSidebar = () => {
  const [user, setUser] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  })
  const [activeItem, setActiveItem] = useState<string>('home')
  const [uid, setUid] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user)
      localStorage.setItem('isAuthenticated', user ? 'true' : 'false')
      if (user) {
        setUid(user.uid)
      } else {
        setUid(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const menuItems = [
    ...(user
      ? [
          {
            id: 'assigned-gigs',
            label: 'Assigned Gigs',
            href: `/assigned-gigs/${uid}`,
            icon: CalendarCheck,
          },
          {
            id: 'posted-gigs',
            label: 'Posted Gigs',
            href: '/posted-gigs',
            icon: Upload,
          },
          {
            id: 'applied-gigs',
            label: 'Applied Gigs',
            href: '/applied-gigs',
            icon: FileText,
          },
          {
            id: 'completed-gigs',
            label: 'Completed Gigs',
            href: `/completed-gigs/${uid}`,
            icon: CheckCircle,
          },
          {
            id: 'messaging',
            label: 'Messaging',
            href: `/messaging/${uid}`,
            icon: MessageSquareMore,
          },
          {
            id: 'getpaid',
            label: 'Wallet',
            href: '/paymentdetails',
            icon: CreditCard,
          },
        ]
      : []),
  ]

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-100 lg:hidden"
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 
          transition-all duration-300 ease-in-out z-40 pt-16
          ${
            isMobileMenuOpen
              ? 'w-64 translate-x-0'
              : 'w-64 -translate-x-full lg:translate-x-0'
          }
        `}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto py-4 px-3">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => {
                      setActiveItem(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl
                      transition-all duration-200 group
                      ${
                        activeItem === item.id
                          ? 'bg-gray-200 text-black font-medium'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                      }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        activeItem === item.id
                          ? 'text-black'
                          : 'text-gray-500 group-hover:text-black'
                      }`}
                    />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Post Gig Button */}
          {user && (
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setIsDialogOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 
                  bg-black text-white rounded-xl hover:bg-gray-800 
                  transition-colors duration-200"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">Post a Gig</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <GigForm isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  )
}

export default LeftSidebar
