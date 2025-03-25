'use client' // Mark this file as a Client Component

import { usePathname } from 'next/navigation'
import { Header } from '@/components'
import LeftSidebar from '@/components/LeftSidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define pages where Header & Sidebar should be hidden
  const hideLayout = pathname === '/login' || pathname === '/register'

  // Define routes where sidebar should be visible
  const showSidebarRoutes = [
    '/assigned-gigs',
    '/posted-gigs',
    '/applied-gigs',
    '/completed-gigs',
    '/paymentdetails',
  ]

  // Check if current path starts with any of the allowed routes
  const shouldShowSidebar = showSidebarRoutes.some(route => 
    pathname.startsWith(route)
  )

  return (
    <div className='w-full'>
      {/* Show Header if not on login/register pages */}
      {!hideLayout && <Header />}
      <div className="flex">
        {/* Show Sidebar only for specific routes and not on login/register pages */}
        {!hideLayout && shouldShowSidebar && <LeftSidebar />}
        <main className={`mx-auto w-full h-full ${shouldShowSidebar ? 'lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  )
}
    