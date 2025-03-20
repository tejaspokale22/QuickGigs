'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Logo from './Logo'
import { auth, signOut } from '@/app/utils/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import logoImg from '../../public/logoImg.png'
import ProfileDropdown from './ProfileDropdown'

const Header = () => {
  // Initialize from localStorage to prevent flicker
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userData')
    return savedUser ? JSON.parse(savedUser) : null
  })

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
        localStorage.setItem('userData', JSON.stringify(userData))
      } else {
        localStorage.removeItem('userData')
      }
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

  return (
    <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between p-3 bg-white z-50 border-b border-gray-200">
      {/* Logo Section */}
      <div className="flex items-center ml-2 gap-1">
        <div className="flex items-center gap-1">
          <Image src={logoImg} width={30} height={39} alt="logo" priority />
          <Logo />
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mr-2 flex items-center gap-3">
        {user ? (
          <ProfileDropdown user={user} handleLogout={handleLogout} />
        ) : (
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
