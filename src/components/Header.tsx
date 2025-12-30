'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'
import { auth, signOut } from '@/app/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import logoImg from '../../public/logoImg.png'
import ProfileDropdown from './ProfileDropdown'

const Header = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('userData')
      if (savedUser) {
        setUser(JSON.parse(savedUser) as User)
      }
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userData = {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          uid: currentUser.uid,
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('userData', JSON.stringify(userData))
          localStorage.setItem('uid', currentUser.uid)
        }
      } else {
        if (typeof window !== 'undefined') {
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

  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 border-b border-gray-100">
        <div className="max-w-full px-4 lg:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src={logoImg} width={38} height={38} alt="logo" />
            <Logo />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 border-b border-gray-100">
      <div className="max-w-full px-4 lg:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Image
              src={logoImg}
              width={38}
              height={38}
              alt="QuickGigs"
              priority
            />
            <Logo />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              Home
            </Link>
            <Link
              href="/gigs"
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              Find Gigs
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <ProfileDropdown user={user} handleLogout={handleLogout} />
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-900 rounded-full transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
