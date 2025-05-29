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
    // Load saved user data
    const savedUser = localStorage.getItem('userData')
    if (savedUser) {
      setUser(JSON.parse(savedUser) as User)
    }

    // Set up auth state listener
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      if (currentUser) {
        const userData = {
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          email: currentUser.email,
          uid: currentUser.uid,
        }
        localStorage.setItem('userData', JSON.stringify(userData))
      } else {
        localStorage.removeItem('userData')
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth) 
      localStorage.removeItem('userData')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Show a minimal header while loading to prevent layout shift
  if (isLoading) {
    return (
      <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between p-3 bg-white z-50 border-b border-gray-200">
        <div className="flex items-center ml-2 gap-6 justify-center">
          <div className="flex items-center gap-1">
            <Image src={logoImg} width={38} height={38} alt="logo" priority />
            <Logo />
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between p-3 bg-white z-50 border-b border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center ml-2 gap-6 justify-center">
        <div className="flex items-center gap-1">
          <Image src={logoImg} width={38} height={38} alt="logo" priority />
          <Logo />
        </div>
        <div className="flex items-center">
          <Link
            href="/"
            className="px-3 py-1.5 flex items-center gap-2 pr-1 justify-center rounded"
          >
            <span className="text-black text-base font-normal">
              Home
            </span>
          </Link>
          <Link
            href="/gigs"
            className="px-3 py-1.5 flex items-center gap-2 pr-2 justify-center rounded"
          >
            <span className="text-black text-base font-normal">
              Find Gigs
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mr-2 flex items-center gap-2">
        {user && <ProfileDropdown user={user} handleLogout={handleLogout} />}

        {!user && (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="bg-white text-black px-3 py-1 text-base font-normal hover:bg-gray-200 rounded"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-black text-white px-3 py-1 text-base font-normal hover:bg-gray-800 rounded"
            >
              Register
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
