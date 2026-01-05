'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/utils/firebase'
import { fetchUser } from '@/utils/actions/authActions'
import { Gig, User } from '@/utils/types'
import { formatDeadline } from '@/utils/utilityFunctions'
import {
  CheckCircle,
  CreditCard,
  Eye,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
} from 'lucide-react'
import PaymentInfoDialog from '@/components/payment/paymentInfoDialog'
import Spinner from '@/components/ui/spinner'
import { approve } from '@/utils/actions/gigActions'
import { useAuth } from '@/context/AuthContext'

export default function PostedGigsPage() {
  const { user } = useAuth()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [freelancers, setFreelancers] = useState<{ [key: string]: User }>({})
  const [paymentInfoDialogOpen, setPaymentInfoDialogOpen] = useState(false)

  //Approve the gig work
  const handleApprove = async (gigId: string) => {
    if (!gigId) return
    try {
      const response = await approve(gigId)
      if (response) {
        // alert("rejected");
      }
    } catch (error) {
      console.error('Error marking as completed!', error)
    }
  }

  useEffect(() => {
    if (!user?.uid) {
      setError('User not authenticated. Please log in.')
      setLoading(false)
      return
    }

    setLoading(true)
    const gigsQuery = query(
      collection(firestore, 'gigs'),
      where('clientId', '==', user.uid),
    )

    const unsubscribe = onSnapshot(
      gigsQuery,
      async (snapshot) => {
        const gigsData: Gig[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Gig[]
        setGigs(gigsData)
        setLoading(false)

        const freelancerDetails: { [key: string]: User } = {}
        await Promise.all(
          gigsData.map(async (gig) => {
            if (gig.freelancerId) {
              try {
                const freelancerData = await fetchUser(gig.freelancerId)
                freelancerDetails[gig.freelancerId] = freelancerData
              } catch (err) {
                console.error('Error fetching freelancer details:', err)
              }
            }
          }),
        )
        setFreelancers(freelancerDetails)
      },
      (error) => {
        console.error('Error fetching gigs:', error)
        setError('Failed to fetch posted gigs. Please try again later.')
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-red-500 text-sm font-semibold">{error}</p>
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Gigs',
      value: gigs.length,
      icon: Briefcase,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'In Progress',
      value: gigs.filter((gig) => gig.status === 'progress').length,
      icon: Clock,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
    {
      label: 'Completed',
      value: gigs.filter((gig) => gig.status === 'completed').length,
      icon: CheckCircle,
      color: 'text-gray-700',
      bgColor: 'bg-gray-100',
    },
  ]

  const statusStyles: Record<
    string,
    { bg: string; text: string; label: string }
  > = {
    pending: {
      bg: 'bg-amber-50 border-amber-100',
      text: 'text-amber-800',
      label: 'Pending',
    },
    progress: {
      bg: 'bg-blue-50 border-blue-100',
      text: 'text-blue-800',
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-emerald-50 border-emerald-100',
      text: 'text-emerald-800',
      label: 'Completed',
    },
    default: {
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-800',
      label: 'Pending',
    },
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Posted Gigs</h1>
          <p className="text-gray-600 mt-2">
            Review and manage your posted gigs
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 shadow-sm hover:shadow-lg hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Gigs List */}
        {gigs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300">
            <Briefcase className="h-14 w-14 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No gigs posted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start by posting your first gig
            </p>
            <Link href="/gig">
              <button className="px-6 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors cursor-pointer">
                Post a Gig
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {gigs.map((gig) => (
              <div
                key={gig.id}
                className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all group"
              >
                {/* Gig Header */}
                <div className="p-6 border-b border-gray-100 bg-linear-to-r from-white to-gray-50">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                          {gig.title}
                        </h2>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                            (statusStyles[gig.status] || statusStyles.default)
                              .bg
                          } ${
                            (statusStyles[gig.status] || statusStyles.default)
                              .text
                          }`}
                        >
                          {
                            (statusStyles[gig.status] || statusStyles.default)
                              .label
                          }
                        </span>
                      </div>
                      <div className="flex items-center gap-4 flex-wrap text-sm text-gray-600">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1.5" />
                          <span>Deadline: {formatDeadline(gig.deadline)}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-1.5" />
                          <span>
                            {gig.freelancerId
                              ? 'Freelancer assigned'
                              : 'Awaiting assignment'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {gig.workStatus === true && (
                      <button
                        onClick={() => setPaymentInfoDialogOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        <CreditCard className="h-5 w-5" />
                        <span>Pay Now</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Gig Content */}
                <div className="p-6 space-y-4">
                  {/* Pending State */}
                  {gig.status === 'pending' && !gig.freelancerId && (
                    <div className="flex items-center justify-between gap-4 flex-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <div className="flex items-center text-gray-700 font-medium">
                        <Users className="h-5 w-5 mr-2 text-gray-500" />
                        <span>Waiting for freelancers to apply</span>
                      </div>
                      <Link
                        href={`/applied-freelancers/${gig.id}`}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Applicants</span>
                      </Link>
                    </div>
                  )}

                  {/* Assigned State */}
                  {(gig.status === 'pending' || gig.status === 'progress') &&
                    gig.freelancerId && (
                      <div className="flex items-center justify-between gap-4 flex-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              freelancers[gig.freelancerId]?.profilePicture ||
                              '/default-avatar.png'
                            }
                            alt={
                              freelancers[gig.freelancerId]?.name ||
                              'Freelancer'
                            }
                            width={44}
                            height={44}
                            className="rounded-full object-cover border-2 border-gray-200"
                          />
                          <div>
                            <p className="text-xs text-gray-600 font-medium">
                              {gig.status === 'pending'
                                ? 'Assigned to'
                                : 'In progress with'}
                            </p>
                            <p className="font-bold text-gray-900">
                              {freelancers[gig.freelancerId]?.name}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Completed State */}
                  {gig.status === 'completed' && (
                    <div className="flex items-center justify-between gap-4 flex-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                      <div className="flex items-center gap-3">
                        <Image
                          src={
                            freelancers[gig.freelancerId || '']
                              ?.profilePicture || '/default-avatar.png'
                          }
                          alt={
                            freelancers[gig.freelancerId || '']?.name ||
                            'Freelancer'
                          }
                          width={44}
                          height={44}
                          className="rounded-full object-cover border-2 border-gray-200"
                        />
                        <div>
                          <p className="text-xs text-gray-600 font-medium">
                            Completed by
                          </p>
                          <p className="font-bold text-gray-900">
                            {freelancers[gig.freelancerId || '']?.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {gig.workStatus
                              ? 'Work approved'
                              : 'Awaiting approval'}
                          </p>
                        </div>
                      </div>

                      {!gig.workStatus && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApprove(gig.id)}
                            className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-300 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer">
                            <AlertCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <PaymentInfoDialog
          isOpen={paymentInfoDialogOpen}
          onClose={() => setPaymentInfoDialogOpen(false)}
          freelancerId={gigs.find((g) => g.workStatus)?.freelancerId || ''}
        />
      </div>
    </div>
  )
}
