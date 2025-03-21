'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/app/utils/firebase'
import { fetchUser } from '@/app/utils/actions/authActions'
import { Gig, User } from '../utils/types'
import { formatDeadline } from '../utils/utilityFunctions'
import { 
  CheckCircle, 
  CreditCard, 
  Eye, 
  Clock,
  Users,
  Briefcase,
  AlertCircle
} from 'lucide-react'
import PaymentInfoDialog from '@/components/payment/paymentInfoDialog'
import Spinner from '@/components/ui/spinner'
import { approve } from '../utils/actions/gigActions'

export default function PostedGigsPage() {
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
    const clientId = localStorage.getItem('uid')
    if (!clientId) {
      setError('User ID not found. Please log in.')
      setLoading(false)
      return
    }

    setLoading(true)
    const gigsQuery = query(
      collection(firestore, 'gigs'),
      where('clientId', '==', clientId),
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
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    )
  }

  const stats = [
    {
      label: 'Total Gigs',
      value: gigs.length,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-700'
    },
    {
      label: 'In Progress',
      value: gigs.filter(gig => gig.status === 'progress').length,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-700'
    },
    {
      label: 'Completed',
      value: gigs.filter(gig => gig.status === 'completed').length,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-700'
    }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Posted Gigs</h1>
        <p className="text-gray-600 mt-2">Manage and track your posted gigs</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 flex items-center"
            >
              <div className={`${stat.color} p-3 rounded-lg`}>
                <Icon className="h-6 w-6" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          )}
        )}
      </div>

      {/* Gigs List */}
      {gigs.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No gigs posted yet</h3>
          <p className="text-gray-600">Start by posting your first gig</p>
        </div>
      ) : (
        <div className="space-y-6">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Gig Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {gig.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-1.5" />
                        {formatDeadline(gig.deadline)}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                          ${gig.status === 'completed'
                            ? 'bg-green-50 text-green-700'
                            : gig.status === 'progress'
                            ? 'bg-yellow-50 text-yellow-700'
                            : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {gig.workStatus === true && (
                    <button
                      onClick={() => setPaymentInfoDialogOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg
                        hover:bg-gray-900 transition-colors duration-200"
                    >
                      <CreditCard className="h-4 w-4" />
                      <span className="font-medium">Pay Now</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Gig Content */}
              <div className="p-6">
                {/* Pending State */}
                {gig.status === 'pending' && !gig.freelancerId && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>Waiting for freelancers to apply</span>
                    </div>
                    <Link
                      href={`/applied-freelancers/${gig.id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 
                        rounded-lg hover:bg-gray-200 transition-colors duration-200"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="font-medium">View Applicants</span>
                    </Link>
                  </div>
                )}

                {/* Assigned State */}
                {(gig.status === 'pending' || gig.status === 'progress') && gig.freelancerId && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={freelancers[gig.freelancerId]?.profilePicture || '/default-avatar.png'}
                        alt={freelancers[gig.freelancerId]?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {freelancers[gig.freelancerId]?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {gig.status === 'pending' ? 'Assigned to' : 'Working on this gig'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Completed State */}
                {gig.status === 'completed' && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={freelancers[gig.freelancerId || '']?.profilePicture || '/default-avatar.png'}
                        alt={freelancers[gig.freelancerId || '']?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">
                          {freelancers[gig.freelancerId || '']?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {gig.workStatus ? 'Work approved' : 'Completed work'}
                        </p>
                      </div>
                    </div>

                    {!gig.workStatus && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleApprove(gig.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white 
                            rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Approve</span>
                        </button>
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white 
                            rounded-lg hover:bg-red-700 transition-colors duration-200"
                        >
                          <AlertCircle className="h-4 w-4" />
                          <span className="font-medium">Reject</span>
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
        freelancerId={gigs.find(g => g.workStatus)?.freelancerId || ''}
      />
    </div>
  )
}
