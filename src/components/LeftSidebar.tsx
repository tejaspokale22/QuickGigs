'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  House,
  ArrowsUpFromLine,
  User,
  CheckCircle,
  CalendarCheck,
  Plus,
  CreditCard,
  Upload,
  FileText,
  Bell,
  MessageSquareMore,
  IndianRupee,
  Search, // Import Notification icon from lucide-react
} from 'lucide-react' // Import icons from lucide-react
import { auth } from '@/app/utils/firebase' // Import Firebase auth
import { onAuthStateChanged } from 'firebase/auth' // Import Firebase's auth state listener
import GigForm from './GigForm'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from '@/components/ui/sidebar'
import Logo from './Logo'
import { Button } from './ui/button'
import { set } from 'date-fns'

// Main LeftSidebar component
const LeftSidebar: React.FC = () => {
  const [user, setUser] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  })
  const [activeItem, setActiveItem] = useState<string>('home') // Track active menu item
  const [uid, setUid] = useState<string | null>(null) // State to hold uid

  // Dialog for GigForm
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const handleOpenDialog = () => setIsDialogOpen(true)
  const handleCloseDialog = () => setIsDialogOpen(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user)
      localStorage.setItem('isAuthenticated', user ? 'true' : 'false')
      if (user) {
        setUid(user.uid) // Set uid from user object
      } else {
        setUid(null) // Clear uid if no user
      }
    })

    return () => unsubscribe()
  }, [])

  // Define the menu items (conditionally add the items based on authentication)
  const menuItems = [
    { id: 'home', label: 'Home', href: '/', icon: House },
    {
      id: 'apply-gig',
      label: 'Find Gigs',
      href: '/gigs',
      icon: Search, // You can replace this with a logo
    },
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
          { id: 'profile', label: 'Profile', href: '/profile', icon: User },
          {
            id: 'getpaid',
            label: 'Get Paid',
            href: '/paymentdetails',
            icon: CreditCard,
          },
          {
            id: 'notifications',
            label: 'Notifications',
            href: '/notifications',
            icon: Bell,
          },
        ]
      : []),
  ]

  // Handle setting active item
  const handleActiveItem = (id: string) => {
    setActiveItem(id)
  }

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      side="left"
      className="pt-16 border border-r border-gray-300"
    >
      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel><Logo/></SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon // Dynamically assign the icon
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      asChild
                      className={`rounded-lg ${
                        activeItem === item.id
                          ? 'bg-gray-300 cursor-pointer pointer-events-none'
                          : 'hover:bg-gray-200 cursor-pointer'
                      } p-4 rounded`}
                    >
                      <Link
                        href={item.href}
                        className="font-medium w-full flex items-center text-left rounded text-base"
                        onClick={() => handleActiveItem(item.id)}
                      >
                        <Icon className=" mr-2" />
                        <span className="text-base text-black">
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          className="bg-black text-white rounded hover:bg-gray-800"
          onClick={handleOpenDialog}
        >
          <Plus size={64} />
          Post a Gig
        </Button>
      </SidebarFooter>
      <GigForm isOpen={isDialogOpen} onClose={handleCloseDialog} />
    </Sidebar>
  )
}

export default LeftSidebar
