'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'
import ProfileDropdown from './ProfileDropdown'
import { auth, signOut } from '@/app/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
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
      'px-3 py-2 text-medium font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-md transition-colors',
  },
  {
    href: '/register',
    label: 'Register',
    className:
      'px-3 py-2 text-medium font-medium text-white bg-black hover:bg-gray-900 rounded-md transition-colors',
  },
]

const Header = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const savedUser = localStorage.getItem('userData')
    if (savedUser) {
      setUser(JSON.parse(savedUser) as User)
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)

      if (typeof window !== 'undefined') {
        if (currentUser) {
          localStorage.setItem(
            'userData',
            JSON.stringify({
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              email: currentUser.email,
              uid: currentUser.uid,
            }),
          )
          localStorage.setItem('uid', currentUser.uid)
        } else {
          localStorage.removeItem('userData')
          localStorage.removeItem('uid')
        }
      }

      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userData')
        localStorage.removeItem('uid')
      }
    } catch (error) {
      console.error('Error signing out:', error)
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

          {!isLoading && (
            <nav className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="px-3 py-2 text-medium font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-md"
                >
                  {label}
                </Link>
              ))}
            </nav>
          )}
        </div>

        {/* Right */}
        {!isLoading && (
          <div className="flex items-center gap-3">
            {user ? (
              <ProfileDropdown user={user} handleLogout={handleLogout} />
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
        )}
      </div>
    </header>
  )
}

export default Header
