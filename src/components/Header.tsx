'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import Logo from './Logo'
import { auth, signOut } from '@/app/utils/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LogOut, UserCircle, LayoutDashboard } from 'lucide-react'
import logoImg from '../../public/logoImg.png'

const Header = () => {
  // Initialize from localStorage to prevent flicker
  const [user, setUser] = useState<User | null>(() => {
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
    <header className="fixed top-0 left-0 right-0 w-full flex items-center justify-between p-2 bg-white border-b border-gray-300 z-50">
      {/* Logo Section */}
      <div className="flex items-center ml-6 gap-1">
        <div className="flex items-center gap-1">
          <Image src={logoImg} width={39} height={39} alt="logo" priority />
          <Logo />
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mr-2 flex items-center gap-3">
        {user ? (
          <TooltipProvider>
            <Tooltip>
              <DropdownMenu>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-10 w-10 rounded-full p-0 hover:bg-gray-100"
                    >
                      {user.photoURL ? (
                        <Image
                          src={user.photoURL}
                          alt="Profile"
                          width={37}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <UserCircle className="h-8 w-8" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent
                  className="bg-black text-white px-3 py-1 text-sm"
                  sideOffset={5}
                >
                  {user.displayName || user.email}
                </TooltipContent>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-white bg-opacity-80 backdrop-blur-sm border border-gray-200"
                >
                  <DropdownMenuItem asChild>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-100"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="bg-white text-black px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md transition"
            >
              Log in
            </Link>
            <Link
              href="/register"
              className="bg-black text-white px-3 py-2 text-sm font-medium hover:bg-gray-800 rounded-md transition"
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
