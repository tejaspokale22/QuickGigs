'use client'

import {
  LogOut,
  LayoutDashboard,
  User,
  ChevronDown,
  UserCircle,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'

interface ProfileDropdownProps {
  user: any
  handleLogout: () => Promise<void>
}

const ProfileDropdown = ({ user, handleLogout }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Menu configuration
  const menuItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Profile',
      href: '/profile',
      icon: User,
    },
  ]

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-100
        transition-all duration-200 hover:bg-gray-200 cursor-pointer"
      >
        <div className="h-8 w-8 flex items-center justify-center">
          {user.photoURL ? (
            <Image
              src={user.photoURL}
              alt="Profile"
              width={32}
              height={32}
              className="rounded-full object-cover"
            />
          ) : (
            <UserCircle className="h-8 w-8" />
          )}
        </div>

        <span className="font-medium text-black">
          {user.displayName || 'User'}
        </span>

        <ChevronDown
          className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-56 rounded-xl bg-white border
          border-gray-200 shadow-lg overflow-hidden animate-in
          fade-in slide-in-from-top-5 duration-200"
        >
          <div className="p-1.5">
            {/* Loop through menu items */}
            {menuItems.map(({ label, href, icon: Icon }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                text-gray-700 hover:bg-gray-100 group hover:text-black"
              >
                <Icon className="h-4 w-4 group-hover:scale-110 transition-transform hover:text-black" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}

            <div className="h-px bg-gray-200 my-1" />

            {/* Logout */}
            <button
              onClick={() => {
                handleLogout()
                setIsOpen(false)
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5
              rounded-lg text-red-600 hover:bg-red-50 cursor-pointer group"
            >
              <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Log out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProfileDropdown
