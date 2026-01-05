'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Bell } from 'lucide-react'
import { signOut } from 'firebase/auth'
import { toast } from 'react-hot-toast'

import { auth } from '@/utils/firebase'
import { useAuth } from '@/context/AuthContext'
import Logo from './Logo'
import ProfileDropdown from './ProfileDropdown'
import logoImg from '../../public/logoImg.png'

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/gigs', label: 'Find Gigs' },
]

const AUTH_LINKS = [
  {
    href: '/login',
    label: 'Log in',
    className:
      'px-3 py-2 text-medium font-medium text-gray-700 hover:text-black hover:bg-gray-200 rounded-md transition-colors',
  },
  {
    href: '/register',
    label: 'Register',
    className:
      'px-3 py-2 text-medium font-medium text-white bg-black hover:bg-gray-800 rounded-md transition-colors',
  },
]

const Header = () => {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully.')
      router.replace('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Failed to log out. Please try again.')
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white border-b border-black/10">
      <div className="px-4 lg:px-6 py-2.5 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
          >
            <Image
              src={logoImg}
              width={40}
              height={40}
              alt="QuickGigs"
              priority
            />
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="px-3 py-2 text-medium font-medium text-gray-700 hover:text-black hover:bg-gray-200 rounded-md"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/notifications"
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <Bell className="h-5 w-5 text-gray-700 group-hover:text-black" />
              </Link>

              <ProfileDropdown user={user} handleLogout={handleLogout} />
            </>
          ) : (
            <div className="flex items-center gap-2">
              {AUTH_LINKS.map(({ href, label, className }) => (
                <Link key={href} href={href} className={className}>
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
