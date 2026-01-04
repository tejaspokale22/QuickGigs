'use client'

import React, { useEffect, useState } from 'react'
import { fetchGigs } from '@/utils/actions/gigActions'
import { fetchUsers } from '@/utils/actions/authActions'
import {
  Check,
  ChevronRightIcon,
  Search,
  Briefcase,
  Filter,
  Clock,
  IndianRupee,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Gig, User } from '@/utils/types'
import {
  formatDeadline,
  getDaysAgo,
  formatCurrency,
} from '@/utils/utilityFunctions'
import { applyForGig } from '@/utils/actions/gigActions'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import { firestore } from '@/utils/firebase'
import { onSnapshot, collection } from 'firebase/firestore'

// Gig Card Component
const GigCard = ({ gig, user }: { gig: Gig; user?: User }) => {
  const [id, setId] = useState<string>('')
  const [applied, setApplied] = useState<boolean>(false)
  const [showDialog, setShowDialog] = useState<boolean>(false)

  useEffect(() => {
    const userId = localStorage.getItem('uid') || ''
    setId(userId)
    if (gig.appliedFreelancers?.includes(userId)) {
      setApplied(true)
    }
  }, [gig.appliedFreelancers])

  const handleApplyConfirm = async () => {
    try {
      await applyForGig(gig.id, id)
      setApplied(true)
      setShowDialog(false)
    } catch (error) {
      console.error('Error applying for the gig:', error)
    }
  }

  return (
    <div className="w-full border-2 border-gray-200 rounded-xl bg-white transition-all duration-300 group overflow-hidden hover:border-black">
      <div className="p-7 space-y-5">
        {/* Header: User Info + Posted Date */}
        {user && (
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3.5">
              <div className="relative w-14 h-14">
                <Image
                  src={user.profilePicture || '/default-avatar.png'}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover border-2 border-gray-200 group-hover:border-gray-300 transition-colors"
                  priority
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {user.name}
                </h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full whitespace-nowrap">
              {getDaysAgo(gig.createdAt)}
            </span>
          </div>
        )}

        {/* Gig Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 line-clamp-2 group-hover:text-black transition-colors">
            {gig.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed text-sm line-clamp-2">
            {gig.description.length > 150 ? (
              <>{gig.description.slice(0, 150)}...</>
            ) : (
              <>{gig.description}</>
            )}
          </p>

          {/* Skills */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {gig.skillsRequired.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold group-hover:bg-gray-200 transition-colors"
                >
                  {skill}
                </span>
              ))}
              {gig.skillsRequired.length > 4 && (
                <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-semibold">
                  +{gig.skillsRequired.length - 4}
                </span>
              )}
            </div>
          </div>

          {/* Price and Deadline */}
          <div className="flex justify-between items-center pt-5 border-t border-gray-200">
            <div className="space-y-1">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                Payout
              </p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{gig.price.toLocaleString()}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-wide">
                Deadline
              </p>
              <p className="text-gray-900 font-bold text-lg">
                {formatDeadline(gig.deadline)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-5 flex justify-end gap-3">
          <Link href={`/gig/${gig.id}`}>
            <Button className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-semibold transition-colors cursor-pointer">
              View details
            </Button>
          </Link>
          {gig.clientId !== id && (
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className={`rounded-lg font-semibold transition-all duration-300 ${
                    applied
                      ? 'bg-gray-500 hover:bg-gray-600 text-white'
                      : 'bg-black hover:bg-gray-800 text-white cursor-pointer'
                  }`}
                  disabled={applied}
                >
                  <span className="group inline-flex items-center">
                    {applied ? (
                      <>
                        Applied
                        <Check className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Apply
                        <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to apply for this gig? This action
                    cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="rounded hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyConfirm}
                    className="bg-black hover:bg-gray-800 text-white rounded"
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}

// Loading Skeleton Component
const GigSkeleton = () => (
  <div className="w-full border border-gray-200 rounded-xl bg-white shadow-sm p-7 space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded" />
    </div>
    <div className="space-y-4">
      <div className="h-6 w-3/4 bg-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  </div>
)

// Page Component
const Page = () => {
  const [gigs, setGigs] = useState<Gig[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])

  const fetchData = async () => {
    try {
      const [gigsData, usersData] = await Promise.all([
        fetchGigs(),
        fetchUsers(),
      ])

      // Sort gigs by createdAt timestamp (latest first)
      const sortedGigs = [...gigsData].sort(
        (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis(),
      )

      setGigs(sortedGigs)
      setUsers(usersData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    const gigsRef = collection(firestore, 'gigs')
    const unsubscribe = onSnapshot(gigsRef, () => {
      fetchData()
    })

    return () => unsubscribe()
  }, [])

  // Get all unique skills from gigs
  const allSkills = Array.from(
    new Set(gigs.flatMap((gig) => gig.skillsRequired)),
  ).sort()

  // Filter gigs based on search, skills, and price
  const filteredGigs = gigs.filter((gig) => {
    const matchesSearch =
      gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSkills =
      selectedSkills.length === 0 ||
      selectedSkills.some((skill) => gig.skillsRequired.includes(skill))
    const matchesPrice =
      gig.price >= priceRange[0] && gig.price <= priceRange[1]
    return matchesSearch && matchesSkills && matchesPrice
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16">
      {/* Compact Header with Search */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl space-y-4">
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Freelance Opportunities
                </h1>
                <p className="text-gray-400 mt-3 text-lg">
                  Discover and apply to gigs that match your expertise
                </p>
              </div>
              <div className="flex items-center gap-6 text-gray-300 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{gigs.length} Active Gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated live</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className="shrink-0 w-full md:w-auto space-y-4">
              <div className="relative">
                <Search className="text-black absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 z-10" />
                <input
                  type="text"
                  placeholder="Search gigs, skills, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-96 pl-12 pr-4 py-3.5 rounded-xl bg-white/95 
                    border border-white/20 text-gray-900 placeholder:text-gray-500
                    focus:outline-none focus:ring-2 focus:ring-white focus:border-white
                    backdrop-blur-sm font-medium transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
            <div
              className="sticky top-24 bg-white rounded-xl border border-gray-200 
              shadow-sm divide-y divide-gray-100 overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>

                {/* Skills Filter */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    Required Skills
                  </h3>
                  <div className="max-h-64 overflow-y-auto space-y-2 scrollbar-thin">
                    {allSkills.map((skill) => (
                      <label
                        key={skill}
                        className="flex items-center gap-2 p-2.5 rounded-lg
                          hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => {
                            setSelectedSkills((prev) =>
                              prev.includes(skill)
                                ? prev.filter((s) => s !== skill)
                                : [...prev, skill],
                            )
                          }}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm text-gray-600">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 text-sm mb-5">
                  Payout Range
                </h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-black"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹0</span>
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <p className="text-gray-700 font-medium">
                <span className="text-gray-900 font-bold text-lg">
                  {filteredGigs.length}
                </span>{' '}
                <span className="text-gray-600">opportunities found</span>
              </p>
              <select
                className="text-sm border border-gray-300 rounded-lg px-4 py-2.5 bg-white
                  text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black
                  hover:border-gray-400 transition-colors"
                title="Sort options"
              >
                <option>Latest First</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>

            {/* Gigs Grid */}
            {loading ? (
              <div className="space-y-4">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <GigSkeleton key={i} />
                  ))}
              </div>
            ) : filteredGigs.length > 0 ? (
              <div className="space-y-4">
                {filteredGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    user={users.find((user) => user.uid === gig.clientId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                <Briefcase className="h-14 w-14 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <button className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors">
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page
