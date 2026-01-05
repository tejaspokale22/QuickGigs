'use client'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { fetchUser } from '@/utils/actions/authActions'
import { getFreelancerPaymentDetails } from '@/utils/actions/paymentActions'
import Image from 'next/image'
import { PaymentInfo, User } from '@/utils/types'
import upi from '@/../public/upi.svg'

interface PaymentInfoDialogProps {
  freelancerId: string
  isOpen: boolean
  onClose: (open: boolean) => void
}

interface PaymentDetails {
  upiDetails: { type: string; value: string } | null
  qrCode: {
    type: string
    value: { fileId: string; fileUrl: string; uploadedAt?: string }
  } | null
}

const PaymentInfoDialog: React.FC<PaymentInfoDialogProps> = ({
  freelancerId,
  isOpen,
  onClose,
}) => {
  const [freelancer, setFreelancer] = useState<User | null>(null)
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upi' | 'qr'>('upi')

  useEffect(() => {
    if (!isOpen) return

    const fetchDetails = async () => {
      try {
        setLoading(true)
        const freelancerData = await fetchUser(freelancerId)
        setFreelancer(freelancerData)

        const paymentData = await getFreelancerPaymentDetails(freelancerId)
        if (typeof paymentData === 'string') {
          setError(paymentData)
          setPaymentDetails(null)
        } else {
          setPaymentDetails(paymentData)
          setError(null)
        }
      } catch (err) {
        console.error('Error fetching details:', err)
        setError('Failed to fetch payment details.')
      } finally {
        setLoading(false)
      }
    }

    fetchDetails()
  }, [freelancerId, isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 text-white p-6 rounded-2xl shadow-2xl border border-slate-700">
        <DialogTitle className="text-center"></DialogTitle>
        <DialogHeader className="flex flex-col items-center space-y-4">
          {freelancer && (
            <>
              <Image
                src={freelancer.profilePicture || '/default-avatar.png'}
                alt={freelancer.name}
                width={64}
                height={64}
                className="w-16 h-16 rounded-full border-3 border-slate-600 shadow-md object-cover"
              />
              <DialogTitle className="text-xl font-bold text-center text-white">
                {freelancer.name}
              </DialogTitle>
              <p className="text-sm text-slate-300">{freelancer.email}</p>
            </>
          )}
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-4 border-slate-600 border-t-white rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-300 font-medium">
              Loading payment details...
            </p>
          </div>
        ) : error ? (
          <div className="py-8 text-center bg-red-900 border border-red-700 rounded-lg">
            <p className="text-red-200 font-medium">{error}</p>
          </div>
        ) : paymentDetails ? (
          <div className="space-y-4 w-full">
            {/* Tab Navigation */}
            <div className="flex gap-2 bg-slate-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('upi')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                  activeTab === 'upi'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-center gap-1">
                  <Image src={upi} alt="UPI" className="w-4 h-4" />
                  UPI
                </div>
              </button>
              <button
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-2 px-3 rounded-lg font-semibold transition-all text-sm ${
                  activeTab === 'qr'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                QR Code
              </button>
            </div>

            {/* UPI Tab */}
            {activeTab === 'upi' && paymentDetails.upiDetails && (
              <div className="w-full bg-slate-700 p-4 rounded-lg border border-slate-600">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-600 border border-slate-500 flex items-center justify-center">
                    <Image src={upi} alt="UPI" width={24} height={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                      UPI ID
                    </p>
                    <p className="text-white font-semibold break-all">
                      {paymentDetails.upiDetails.value}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* QR Code Tab */}
            {activeTab === 'qr' &&
              paymentDetails.qrCode &&
              typeof paymentDetails.qrCode.value === 'object' && (
                <div className="w-full space-y-3">
                  <div className="bg-slate-700 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">📱</span>
                      <div>
                        <p className="text-xs font-semibold text-gray-300 uppercase tracking-wide">
                          QR Code
                        </p>
                        <p className="text-sm text-gray-200 font-medium">
                          Scan to pay
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full rounded-lg overflow-hidden border-2 border-slate-600 bg-white p-4 flex justify-center">
                    <Image
                      src={paymentDetails.qrCode.value.fileUrl}
                      alt="UPI QR Code"
                      width={200}
                      height={200}
                      className="w-48 h-48 object-contain"
                      onError={() => console.error('Failed to load QR image')}
                    />
                  </div>

                  {paymentDetails.qrCode.value.uploadedAt && (
                    <p className="text-xs text-gray-400 text-center">
                      Uploaded on{' '}
                      {new Date(
                        paymentDetails.qrCode.value.uploadedAt,
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              )}

            {activeTab === 'upi' && !paymentDetails.upiDetails && (
              <div className="py-6 text-center bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg">
                <p className="text-slate-300 font-medium">
                  No UPI ID available
                </p>
              </div>
            )}

            {activeTab === 'qr' && !paymentDetails.qrCode && (
              <div className="py-6 text-center bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg">
                <p className="text-slate-300 font-medium">
                  No QR Code available
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center bg-slate-700 border-2 border-dashed border-slate-600 rounded-lg">
            <p className="text-slate-300 font-medium">
              Freelancer details not found
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default PaymentInfoDialog
