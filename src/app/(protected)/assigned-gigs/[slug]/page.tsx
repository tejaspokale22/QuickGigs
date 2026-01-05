'use client'

import { useEffect, useState } from 'react'
import { Gig, User } from '@/utils/types'
import { formatDeadline } from '@/utils/utilityFunctions'
import { firestore } from '@/utils/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { fetchUser } from '@/utils/actions/authActions'
import { Mail, Clock, Users, Copy, Check, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Image from 'next/image'
import Spinner from '@/components/ui/spinner'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  markAsCompleted,
  acceptGig,
  rejectGig,
} from '@/utils/actions/gigActions'
import { approvePayment } from '@/utils/actions/paymentActions'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { copyToClipboard } from '@/utils/utilityFunctions'

const AssignedGigsPage = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [gigs, setGigs] = useState<Gig[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [clients, setClients] = useState<{ [key: string]: User }>({})
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: boolean
  }>({})
  const [decisionLoading, setDecisionLoading] = useState<{
    [key: string]: boolean
  }>({})
  const [clipboardStatus, setClipboardStatus] = useState<{
    [key: string]: boolean
  }>({})
  const [selectedGig, setSelectedGig] = useState<string | null>(null)

  useEffect(() => {
    if (!user?.uid) {
      setError('User not authenticated. Please log in.')
      setLoading(false)
      return
    }

    const gigsRef = collection(firestore, 'gigs')
    const q = query(gigsRef, where('freelancerId', '==', user.uid))

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const gigsData: Gig[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Gig[]

        setGigs(gigsData)
        setLoading(false)

        const clientDetails: { [key: string]: User } = {}
        await Promise.all(
          gigsData.map(async (gig) => {
            if (gig.clientId && !clientDetails[gig.clientId]) {
              try {
                const clientData = await fetchUser(gig.clientId)
                clientDetails[gig.clientId] = clientData
              } catch (err) {
                console.error('Error fetching client details:', err)
              }
            }
          }),
        )
        setClients(clientDetails)
      },
      (error) => {
        console.error('Error fetching gigs:', error)
        setError('Failed to load gigs.')
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [user])

  const handleMarkComplete = async (gigId: string) => {
    if (!gigId) return
    setActionLoading((prev) => ({ ...prev, [gigId]: true }))
    try {
      await markAsCompleted(gigId)
      toast.success('Marked as completed')
    } catch (err) {
      console.error('Error marking gig as completed:', err)
      toast.error('Failed to mark as completed')
    } finally {
      setActionLoading((prev) => ({ ...prev, [gigId]: false }))
    }
  }

  const handleClipboard = (email: string, gigId: string) => {
    copyToClipboard(email)
    setClipboardStatus((prev) => ({ ...prev, [gigId]: true }))
    setTimeout(() => {
      setClipboardStatus((prev) => ({ ...prev, [gigId]: false }))
    }, 2000)
  }

  const handleApprovePayment = async () => {
    if (!selectedGig) return
    setActionLoading((prev) => ({ ...prev, [selectedGig]: true }))
    try {
      await approvePayment(selectedGig)
      toast.success('Payment approved successfully!')
    } catch (err) {
      console.error('Error approving payment:', err)
      toast.error('Failed to approve payment')
    } finally {
      setActionLoading((prev) => ({ ...prev, [selectedGig]: false }))
    }
  }

  const handleAccept = async () => {
    if (!selectedGig) return
    setDecisionLoading((prev) => ({ ...prev, [selectedGig]: true }))
    try {
      await acceptGig(selectedGig)
      toast.success('Gig accepted')
    } catch (err) {
      console.error('Error accepting gig:', err)
      toast.error('Failed to accept gig')
    } finally {
      setDecisionLoading((prev) => ({ ...prev, [selectedGig]: false }))
    }
  }

  const handleReject = async () => {
    if (!selectedGig) return
    setDecisionLoading((prev) => ({ ...prev, [selectedGig]: true }))
    try {
      await rejectGig(selectedGig)
      toast.success('Gig rejected')
    } catch (err) {
      console.error('Error rejecting gig:', err)
      toast.error('Failed to reject gig')
    } finally {
      setDecisionLoading((prev) => ({ ...prev, [selectedGig]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Assigned Gigs
            </h2>
            <p className="text-gray-600">
              Manage your current work assignments
            </p>
          </div>
          <div className="h-64">
            <Spinner />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Assigned Gigs
            </h2>
            <p className="text-gray-600">
              Manage your current work assignments
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-center text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (gigs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Assigned Gigs
            </h2>
            <p className="text-gray-600">
              Manage your current work assignments
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 p-8">
            <p className="text-center text-gray-500 text-lg">
              No assigned gigs found.
            </p>
          </div>
        </div>
      </div>
    )
  }

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
      label: 'Assigned',
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Assigned Gigs
          </h2>
          <p className="text-gray-600">Manage your current work assignments</p>
        </div>

        <div className="space-y-5">
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="block bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-gray-300 transition-all group"
            >
              <div className="p-6 border-b border-gray-100 bg-linear-to-r from-white to-gray-50">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-black transition-colors line-clamp-2">
                        {gig.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          (statusStyles[gig.status] || statusStyles.default).bg
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
                        <Mail className="h-4 w-4 mr-1.5" />
                        <span>
                          {clients[gig.clientId]?.email || 'Client details'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 text-xs font-semibold">
                      {gig.status === 'completed'
                        ? 'Completed'
                        : gig.status === 'progress'
                        ? 'In progress'
                        : 'Assigned'}
                    </div>
                    <div className="text-gray-800 text-sm font-semibold bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                      ₹{gig.price}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {clients[gig.clientId] && (
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                    <Image
                      src={
                        clients[gig.clientId].profilePicture ||
                        '/default-avatar.png'
                      }
                      alt={clients[gig.clientId].name}
                      width={44}
                      height={44}
                      className="rounded-full border-2 border-gray-100 object-cover"
                    />
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="text-base font-semibold text-gray-900">
                        {clients[gig.clientId].name}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3" />
                        <span>{clients[gig.clientId].email}</span>
                        <button
                          onClick={() => {
                            handleClipboard(clients[gig.clientId].email, gig.id)
                          }}
                          className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded px-2 py-1 cursor-pointer"
                          aria-label="Copy email"
                        >
                          {clipboardStatus[gig.id] ? (
                            <Check className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between gap-4 flex-wrap bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
                  <div className="flex items-center text-gray-700 font-medium">
                    <Users className="h-5 w-5 mr-2 text-gray-500" />
                    <span>
                      {gig.status === 'completed'
                        ? 'Work delivered'
                        : gig.status === 'progress'
                        ? 'Work in progress'
                        : 'Awaiting updates'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Payout:{' '}
                    <span className="font-semibold text-gray-900">
                      ₹{gig.price}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <button
                    onClick={() => router.push(`/assigned-gigs/${gig.id}`)}
                    className="text-sm font-semibold text-gray-900 hover:text-black inline-flex items-center gap-1 cursor-pointer px-2 py-1 rounded hover:bg-gray-100"
                  >
                    View details
                  </button>

                  {gig.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => {
                              setSelectedGig(gig.id)
                            }}
                            className="flex items-center gap-1 text-green-700 border border-green-600 px-3 py-1.5 rounded hover:bg-green-50 cursor-pointer"
                          >
                            <Check className="w-4 h-4" /> Accept
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-black">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm acceptance
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to accept this gig?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white text-black rounded">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-black text-white rounded hover:bg-gray-800"
                              onClick={handleAccept}
                              disabled={decisionLoading[gig.id]}
                            >
                              {decisionLoading[gig.id]
                                ? 'Accepting...'
                                : 'Yes, Accept'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            onClick={() => {
                              setSelectedGig(gig.id)
                            }}
                            className="flex items-center gap-1 text-red-700 border border-red-600 px-3 py-1.5 rounded hover:bg-red-50 cursor-pointer"
                          >
                            <X className="w-4 h-4" /> Reject
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-black">
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirm rejection
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to reject this gig?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-white text-black rounded">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-black text-white rounded hover:bg-gray-800"
                              onClick={handleReject}
                              disabled={decisionLoading[gig.id]}
                            >
                              {decisionLoading[gig.id]
                                ? 'Rejecting...'
                                : 'Yes, Reject'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  )}

                  {gig.status === 'progress' && (
                    <button
                      onClick={() => {
                        handleMarkComplete(gig.id)
                      }}
                      disabled={actionLoading[gig.id]}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 disabled:opacity-60 transition-colors cursor-pointer"
                    >
                      {actionLoading[gig.id]
                        ? 'Marking...'
                        : 'Mark as Completed'}
                    </button>
                  )}

                  {gig.status === 'completed' && gig.workStatus === false && (
                    <div className="flex items-center gap-2 text-sm font-semibold text-amber-800 bg-amber-50 border border-amber-100 px-4 py-2 rounded-lg">
                      <Clock className="w-4 h-4" />
                      Awaiting client approval
                    </div>
                  )}

                  {gig.status === 'completed' && gig.workStatus === true && (
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-100 px-4 py-2 rounded-lg">
                        <Check className="w-4 h-4" />
                        Work approved by client
                      </div>
                      {gig.paymentStatus !== true && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => {
                                setSelectedGig(gig.id)
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 cursor-pointer"
                            >
                              Approve Payment
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white text-black">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-xl font-bold">
                                Confirm Payment Approval
                              </AlertDialogTitle>
                              <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
                                Please confirm that you have received the
                                payment from the client before approving.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4">
                              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded text-sm">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded text-sm"
                                onClick={handleApprovePayment}
                                disabled={actionLoading[gig.id]}
                              >
                                {actionLoading[gig.id]
                                  ? 'Approving...'
                                  : 'Confirm Approval'}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      {gig.paymentStatus === true && (
                        <div className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-xs border border-blue-100">
                          Payment approved
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssignedGigsPage
