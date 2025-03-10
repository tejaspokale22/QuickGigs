'use client'

import { LogOut, LayoutDashboard, User, Bell } from 'lucide-react'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from './ui/button'
import Image from 'next/image'
import { UserCircle } from 'lucide-react'

interface ProfileDropdownProps {
  user: any
  handleLogout: () => Promise<void>
}

const ProfileDropdown = ({ user, handleLogout }: ProfileDropdownProps) => {
  return (
    <DropdownMenu>
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
              height={37}
              className="rounded-full object-cover"
            />
          ) : (
            <UserCircle className="h-8 w-8" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 p-1.5 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg"
      >
        <DropdownMenuItem 
          asChild 
          className="hover:bg-gray-200 data-[highlighted]:bg-gray-200 cursor-pointer"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
              text-gray-700 transition-all duration-200
              focus:outline-none"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span className="font-medium">Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          asChild 
          className="hover:bg-gray-200 data-[highlighted]:bg-gray-200 cursor-pointer"
        >
          <Link
            href="/profile"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
              text-gray-700 transition-all duration-200
              focus:outline-none"
          >
            <User className="h-4 w-4" />
            <span className="font-medium">Profile</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem 
          asChild 
          className="hover:bg-gray-200 data-[highlighted]:bg-gray-200 cursor-pointer"
        >
          <Link
            href="/notifications"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
              text-gray-700 transition-all duration-200
              focus:outline-none"
          >
            <Bell className="h-4 w-4" />
            <span className="font-medium">Notifications</span>
          </Link>
        </DropdownMenuItem>

        <div className="h-px bg-gray-200 my-1 mx-2" />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg
            text-red-600 transition-all duration-200
            hover:bg-red-100 data-[highlighted]:bg-red-100 cursor-pointer
            focus:outline-none"
        >
          <LogOut className="h-4 w-4" />
          <span className="font-medium">Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ProfileDropdown 