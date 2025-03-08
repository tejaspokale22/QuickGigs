'use client' // Mark this file as a Client Component

import { usePathname } from 'next/navigation'
import { Header } from '@/components'
import LeftSidebar from '@/components/LeftSidebar'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Define pages where Header & Sidebar should be hidden
  const hideLayout = pathname === '/login' || pathname === '/register'

  return (
    <div className='w-screen'>
      {/* Show Header and Sidebars only if not on login/register pages */}
      {!hideLayout && <Header />}
      <div className="flex">
        {/* {!hideLayout && <LeftSidebar />}  */}
        <main className="mx-auto w-full h-full">{children}</main>
      </div>
    </div>
  )
}
    