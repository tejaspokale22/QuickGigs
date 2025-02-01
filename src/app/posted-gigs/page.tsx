'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/app/utils/firebase'
import { fetchUser } from '@/app/utils/actions/authActions'
import { Gig, User } from '../utils/types'
import { formatDeadline } from '../utils/utilityFunctions'
import { Button } from '@/components/ui/button'
import { CheckCircle, Eye, IndianRupee } from 'lucide-react'
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
import { approve } from '../utils/actions/gigActions'
import PaymentInfoDialog from '@/components/payment/paymentInfoDialog'

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

  if (loading) return <p className="text-center">Loading posted gigs...</p>
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Posted Gigs</h1>
      {gigs.length === 0 ? (
        <p className="text-center">No gigs found.</p>
      ) : (
        <ul className="space-y-4">
          {gigs.map((gig) => (
            <li
              key={gig.id}
              className="bg-white shadow rounded-lg p-4 border border-gray-400"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold">{gig.title}</h2>
                  <p>
                    <strong>Deadline:</strong> {formatDeadline(gig.deadline)}
                  </p>
                  <p
                    className={`mt-3 font-medium text-sm px-3 py-1 inline-block rounded ${
                      gig.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : gig.status === 'progress'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Status:{' '}
                    {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                  </p>
                </div>
                {gig.workStatus === true && (
                  <Button
                    className="bg-black text-white rounded hover:bg-gray-800"
                    onClick={() => setPaymentInfoDialogOpen(true)}
                  >
                    <IndianRupee />
                    Pay Now
                  </Button>
                )}
                <PaymentInfoDialog
                  isOpen={paymentInfoDialogOpen}
                  onClose={() => setPaymentInfoDialogOpen(false)}
                  freelancerId={gig.freelancerId || ''}
                />
              </div>

              {gig.status === 'pending' && !gig.freelancerId && (
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-sm text-gray-600">
                    Assign the gig to some freelancer
                  </p>
                  <Link href={`/applied-freelancers/${gig.id}`}>
                    <Button className="text-white w-40 p-1 text-sm bg-black hover:bg-gray-800 rounded">
                      <Eye /> View Freelancers
                    </Button>
                  </Link>
                </div>
              )}

              {gig.status === 'pending' && gig.freelancerId && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm text-gray-600">Gig request sent to</p>
                  <img
                    src={
                      freelancers[gig.freelancerId]?.profilePicture ||
                      '/default-avatar.png'
                    }
                    alt={freelancers[gig.freelancerId]?.name}
                    className="w-10 h-10 rounded-full border border-gray-300"
                  />
                  <p>{freelancers[gig.freelancerId]?.name}</p>
                </div>
              )}

              {gig.status === 'progress' && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm text-gray-600">Gig Assigned to</p>
                  {gig.freelancerId && freelancers[gig.freelancerId] ? (
                    <>
                      <img
                        src={
                          freelancers[gig.freelancerId]?.profilePicture ||
                          '/default-avatar.png'
                        }
                        alt={
                          freelancers[gig.freelancerId]?.name ?? 'Freelancer'
                        }
                        className="w-10 h-10 rounded-full border border-gray-300"
                      />
                      <p>
                        {freelancers[gig.freelancerId]?.name ??
                          'Unknown Freelancer'}
                      </p>
                    </>
                  ) : (
                    <p>No freelancer assigned</p>
                  )}
                </div>
              )}

              {gig.status === 'completed' && !gig.workStatus && (
                <div className="mt-4 flex justify-between items-center border-t pt-2 text-sm">
                  <div className="flex items-center">
                    <p className="text-black font-normal text-sm mr-2">
                      Gig has been completed by
                    </p>
                    {gig.freelancerId && freelancers[gig.freelancerId] ? (
                      <div className="flex justify-center items-center gap-1">
                        <img
                          src={
                            freelancers[gig.freelancerId]?.profilePicture ||
                            '/default-avatar.png'
                          }
                          alt={
                            freelancers[gig.freelancerId]?.name ?? 'Freelancer'
                          }
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <p className="font-medium text-base">
                          {freelancers[gig.freelancerId]?.name ??
                            'Unknown Freelancer'}
                        </p>
                      </div>
                    ) : (
                      <p>No freelancer info</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {/*Approve Gig work*/}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">
                          Approve
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-white text-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Please Confirm!</AlertDialogTitle>
                          <AlertDialogDescription>
                            After approving the work of the freelancer you need
                            to pay him.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="bg-white text-black rounded">
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-black text-white rounded hover:bg-gray-800"
                            onClick={() => handleApprove(gig.id)}
                          >
                            Yes, Approve
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    <Button className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">
                      Disapprove
                    </Button>
                  </div>
                </div>
              )}
              {gig.status === 'completed' && gig.workStatus && (
                <div className="mt-4 flex justify-between items-center border-t pt-2 text-sm">
                  <div className="flex items-center">
                    <p className="text-black font-normal text-sm mr-2">
                      Work by
                    </p>
                    {gig.freelancerId && freelancers[gig.freelancerId] ? (
                      <div className="flex justify-center items-center gap-1">
                        <img
                          src={
                            freelancers[gig.freelancerId]?.profilePicture ||
                            '/default-avatar.png'
                          }
                          alt={
                            freelancers[gig.freelancerId]?.name ?? 'Freelancer'
                          }
                          className="w-8 h-8 rounded-full border border-gray-300"
                        />
                        <p className="font-medium text-base mr-1">
                          {freelancers[gig.freelancerId]?.name ??
                            'Unknown Freelancer'}
                        </p>
                      </div>
                    ) : (
                      <p>No freelancer info</p>
                    )}{' '}
                    has been successfully Approved!
                  </div>

                  <div className="flex justify-center items-center">
                    <Button
                      className="bg-green-100 text-green-700 rounded"
                      disabled={false}
                    >
                      <CheckCircle /> Approved
                    </Button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
