'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Calendar,
  DollarSign,
  Clock,
  Briefcase,
  FileText,
  Download,
  Eye,
} from 'lucide-react'
import { fetchGigById } from '@/utils/actions/gigActions'
import { Gig } from '@/utils/types'
import LeftSidebar from '@/components/LeftSidebar'
import Spinner from '@/components/ui/spinner'

export default function GigDetailsPage() {
  const { slug } = useParams() as { slug: string }
  const [gig, setGig] = useState<Gig | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setError('Invalid slug. Cannot fetch gig details.')
      setLoading(false)
      return
    }

    const fetchGig = async () => {
      try {
        setLoading(true)
        const fetchedGig = await fetchGigById(slug)

        if (fetchedGig) {
          setGig(fetchedGig)
        } else {
          setError('Gig not found.')
        }
      } catch (err) {
        console.error('Error fetching gig details:', err)
        setError('Failed to fetch gig details. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchGig()
  }, [slug])

  return (
    <div className="flex w-full min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      <div className="w-64 fixed left-0 h-full pt-16 border-r border-gray-200 bg-white shadow-sm">
        <LeftSidebar />
      </div>

      <main className="flex-1 ml-64 p-8 pt-24">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <Spinner />
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
              <p className="text-red-600 font-medium">{error}</p>
            </div>
          ) : gig ? (
            <GigDetails gig={gig} />
          ) : null}
        </div>
      </main>
    </div>
  )
}

type GigDetailsProps = {
  gig: Gig
}

function GigDetails({ gig }: GigDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {gig.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">{gig.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InfoCard
            icon={Calendar}
            label="Posted Date"
            value={gig.createdAt.toDate().toLocaleDateString()}
            color="text-blue-600"
            bgColor="bg-blue-50"
          />
          <InfoCard
            icon={Clock}
            label="Deadline"
            value={gig.deadline.toDate().toLocaleDateString()}
            color="text-orange-600"
            bgColor="bg-orange-50"
          />
          <InfoCard
            icon={DollarSign}
            label="Payout"
            value={`$${gig.price}`}
            color="text-green-600"
            bgColor="bg-green-50"
          />
        </div>
      </div>

      {gig.skillsRequired && gig.skillsRequired.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Skills Required</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {gig.skillsRequired.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 bg-linear-to-r from-blue-50 to-indigo-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {gig.attachments && gig.attachments.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-gray-700" />
            <h2 className="text-xl font-bold text-gray-900">Attachments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gig.attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

type InfoCardProps = {
  icon: React.ElementType
  label: string
  value: string
  color: string
  bgColor: string
}

function InfoCard({ icon: Icon, label, value, color, bgColor }: InfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <div className={`${bgColor} p-2 rounded-lg`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <span className="text-gray-600 text-sm font-medium">{label}</span>
      </div>
      <p className="text-gray-900 font-bold text-lg ml-11">{value}</p>
    </div>
  )
}

type AttachmentProps = {
  attachment: {
    fileUrl?: string
    fileName?: string
    fileType?: string
  }
}

function AttachmentPreview({ attachment }: AttachmentProps) {
  const isImage = attachment.fileType?.startsWith('image')

  return (
    <div className="group relative border border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 hover:shadow-md transition-all bg-white">
      {isImage ? (
        <div className="relative h-48 bg-gray-100">
          <img
            src={attachment.fileUrl}
            alt={attachment.fileName || 'Attachment'}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ) : (
        <div className="h-48 flex flex-col items-center justify-center bg-linear-to-br from-gray-50 to-gray-100">
          <FileText className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-gray-600 text-sm font-medium px-4 text-center truncate max-w-full">
            {attachment.fileName || 'File'}
          </p>
        </div>
      )}
      <div className="p-4">
        <p className="text-sm text-gray-700 font-medium mb-3 truncate">
          {attachment.fileName || 'Unnamed file'}
        </p>
        <div className="flex items-center gap-2">
          <a
            href={attachment.fileUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            <Eye className="w-4 h-4" />
            View
          </a>
          <span className="text-gray-300">|</span>
          <a
            href={attachment.fileUrl || '#'}
            download
            className="flex items-center gap-1.5 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
