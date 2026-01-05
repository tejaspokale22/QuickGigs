'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchGigById } from '@/utils/actions/gigActions'
import { fetchUser } from '@/utils/actions/authActions'
import Image from 'next/image'
import { Eye, Mail, Copy, ArrowLeft } from 'lucide-react'
import { findBestFreelancer } from '@/utils/ai/findBestFreelancer'
import Gemini from '@/../public/gemini.svg'
import Link from 'next/link'
import { copyToClipboard } from '@/utils/utilityFunctions'
import { Check } from 'lucide-react'
import { firestore } from '@/utils/firebase'
import { onSnapshot, doc } from 'firebase/firestore'
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
import { updateGigFreelancer } from '@/utils/actions/gigActions'
import { useRouter } from 'next/navigation'
import Spinner from '@/components/ui/spinner'

export default function AppliedFreelancersPage() {
  const { slug } = useParams() as { slug: string }
  const [freelancers, setFreelancers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [bestFreelancer, setBestFreelancer] = useState<any | null>(null)
  const [aiLoading, setAiLoading] = useState<boolean>(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [clipboardStatus, setClipboardStatus] = useState<{
    [key: string]: boolean
  }>({})
  const [selectedFreelancer, setSelectedFreelancer] = useState<string | null>(
    null,
  )
  const router = useRouter()

  const handleClipboard = (text: string, freelancerId: string) => {
    setClipboardStatus((prev) => ({ ...prev, [freelancerId]: true }))
    copyToClipboard(text)

    setTimeout(() => {
      setClipboardStatus((prev) => ({ ...prev, [freelancerId]: false }))
    }, 2000)
  }

  const handleAssignGig = async () => {
    if (!selectedFreelancer || !slug) return

    try {
      const response = await updateGigFreelancer(slug, selectedFreelancer)
      if (response) {
        router.push('/posted-gigs')
      }
    } catch (error) {
      console.error('Error assigning freelancer:', error)
    }
  }

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true)
      setError(null)

      try {
        if (!slug) return

        // Reference to the specific gig document
        const gigRef = doc(firestore, 'gigs', slug)

        // Set up real-time listener for changes in the gig document
        const unsubscribe = onSnapshot(gigRef, async (snapshot) => {
          if (!snapshot.exists()) {
            setError('Gig not found')
            return
          }

          const gigData = snapshot.data()
          const { appliedFreelancers = [] } = gigData

          // Fetch details of newly applied freelancers
          const freelancerDetails = await Promise.all(
            appliedFreelancers.map((userId: string) => fetchUser(userId)),
          )

          setFreelancers(freelancerDetails)
          setLoading(false)
        })
        // Cleanup function to unsubscribe when component unmounts
        return () => unsubscribe()
      } catch (err) {
        console.error(err)
        setError('Failed to fetch freelancers. Please try again later.')
      }
    }

    fetchFreelancers()
  }, [slug])

  const handleFindBestFreelancer = async () => {
    try {
      setAiLoading(true)
      setAiError(null)
      setBestFreelancer(null)

      const gig = await fetchGigById(slug)
      if (!gig) throw new Error('Gig not found')

      const gigDetails = {
        title: gig.title,
        description: gig.description,
        requiredSkills: gig.skillsRequired,
      }

      const freelancersData = freelancers.map((freelancer) => ({
        name: freelancer.name,
        skills: freelancer.skills,
        experience: freelancer.experience,
        rating: freelancer.rating || 4.5,
        bio: freelancer.bio,
        profilePicture: freelancer.profilePicture,
      }))
      const result = await findBestFreelancer(gigDetails, freelancersData)
      setBestFreelancer(result)
    } catch (err) {
      console.error(err)
      setAiError('Failed to find the best freelancer. Please try again later.')
    } finally {
      setAiLoading(false)
    }
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-red-500 text-center font-medium">Error: {error}</p>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-gray-100 pt-20 pb-12">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-gray-800 bg-white border border-gray-200 rounded-lg font-medium hover:bg-gray-50 px-4 py-2 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {freelancers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-10 text-center shadow-sm">
            <p className="text-gray-700 text-lg font-semibold mb-2">
              No freelancers have applied yet
            </p>
            <p className="text-gray-500">
              Share your gig link to get more applications.
            </p>
          </div>
        ) : (
          <>
            {/* AI Analysis */}
            <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 font-semibold uppercase tracking-wide">
                    AI Assistant
                  </p>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Find the best match
                  </h2>
                  <p className="text-gray-600 mt-1 text-sm">
                    Let Gemini rank your applicants using skills and experience.
                  </p>
                </div>
                <button
                  className="inline-flex items-center px-4 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow"
                  onClick={handleFindBestFreelancer}
                  disabled={aiLoading || freelancers.length === 0}
                >
                  <Image
                    src={Gemini}
                    alt="Gemini Icon"
                    className="mr-2"
                    width={20}
                    height={20}
                  />
                  {aiLoading ? 'Analyzing...' : 'Find Best Match'}
                </button>
              </div>

              {bestFreelancer && (
                <div className="mt-5 p-5 bg-gray-50 rounded-xl border border-gray-200 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative">
                    <Image
                      src={
                        bestFreelancer.profilePicture || '/default-avatar.png'
                      }
                      alt={bestFreelancer.name}
                      className="rounded-full object-cover"
                      width={64}
                      height={64}
                    />
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
                      Best Match
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {bestFreelancer.name}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1 leading-relaxed">
                      {bestFreelancer.reason}
                    </p>
                  </div>
                </div>
              )}

              {aiError && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {aiError}
                </div>
              )}
            </section>

            {/* Freelancers Grid */}
            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Applied Freelancers ({freelancers.length})
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {freelancers.map((freelancer) => (
                  <div
                    key={`${freelancer.id}-${freelancer.name}`}
                    className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={freelancer.profilePicture || '/default-avatar.png'}
                        alt={`${freelancer.name}'s profile`}
                        className="rounded-full object-cover"
                        width={52}
                        height={52}
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {freelancer.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Mail className="w-3.5 h-3.5" />
                          <span className="truncate">{freelancer.email}</span>
                          <button
                            onClick={() =>
                              handleClipboard(freelancer.email, freelancer.uid)
                            }
                            className="text-gray-400 hover:text-gray-700 transition-colors"
                            title="Copy email"
                          >
                            {clipboardStatus[freelancer.uid] ? (
                              <Check className="w-4 h-4 text-gray-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {(freelancer.skills || [])
                        .slice(0, 4)
                        .map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full border border-gray-200"
                          >
                            {skill}
                          </span>
                        ))}
                      {(freelancer.skills || []).length === 0 && (
                        <span className="text-gray-500">No skills listed</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <Link
                        href={`/view-profile/${freelancer.uid}`}
                        className="flex-1"
                      >
                        <button className="w-full inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-semibold rounded-lg text-gray-700 bg-white hover:bg-gray-50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Profile
                        </button>
                      </Link>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800"
                            onClick={() =>
                              setSelectedFreelancer(freelancer.uid)
                            }
                          >
                            Assign
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-semibold">
                              Confirm assignment
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-gray-600">
                              Assign this gig to {freelancer.name}? This cannot
                              be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded transition-colors">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                              onClick={handleAssignGig}
                            >
                              Confirm
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}
