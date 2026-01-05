'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { CheckCircle, Camera } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Image from 'next/image'
import upi from '@/../public/upi.svg'
import {
  saveUpiId,
  saveQRCode,
  getFreelancerPaymentDetails,
} from '@/utils/actions/paymentActions'
import { fetchUser } from '@/utils/actions/authActions'
import { User } from '@/utils/types'
import Spinner from '@/components/ui/spinner'
import QRCodeUpload from '@/components/payment/QRCodeUpload'
import { useAuth } from '@/context/AuthContext'

type PaymentDetails = {
  upiDetails: { type: string; value: string } | null
  qrCode: {
    type: string
    value: {
      fileId: string
      fileUrl: string
      uploadedAt?: string
    }
  } | null
}

type PaymentResponse = PaymentDetails | string

export default function PaymentPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'upi' | 'qr'>('upi')
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentInfo, setPaymentInfo] = useState<PaymentDetails | null>(null)
  const [paymentLoading, setPaymentLoading] = useState(true)
  const [qrUploading, setQrUploading] = useState(false)

  // UPI form
  const {
    register: registerUpi,
    handleSubmit: handleSubmitUpi,
    formState: { errors: errorsUpi },
    reset: resetUpi,
  } = useForm()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user?.uid) {
          setLoading(false)
          return
        }
        const userData = await fetchUser(user.uid)
        setUserProfile(userData)
      } catch (error) {
        console.error('Error fetching user profile:', error)
        toast.error('Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    const fetchPaymentInfo = async () => {
      try {
        if (!user?.uid) {
          setPaymentLoading(false)
          return
        }
        const paymentData = (await getFreelancerPaymentDetails(
          user.uid,
        )) as PaymentResponse
        if (typeof paymentData === 'string') {
          setPaymentInfo(null)
        } else {
          setPaymentInfo(paymentData)
        }
      } catch (error) {
        console.error('Error fetching payment info:', error)
        setPaymentInfo(null)
      } finally {
        setPaymentLoading(false)
      }
    }

    fetchUserProfile()
    fetchPaymentInfo()
  }, [user?.uid])

  const getInitials = (name: string) => {
    if (!name) return ''
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  const onSubmitUpi = async (data: any) => {
    try {
      if (!user?.uid) {
        toast.error('Please login to continue')
        return
      }

      await saveUpiId(user.uid, data.upiId)
      toast.success('UPI ID saved successfully!')
      resetUpi()

      // Refresh payment info
      const paymentData = (await getFreelancerPaymentDetails(
        user.uid,
      )) as PaymentResponse
      if (typeof paymentData !== 'string') {
        setPaymentInfo(paymentData)
      }

      setOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Failed to save UPI ID')
    }
  }

  const handleQRUpload = async (file: File) => {
    try {
      if (!user?.uid) {
        toast.error('Please login to continue')
        return
      }

      setQrUploading(true)
      await saveQRCode(user.uid, file)

      // Refresh payment info
      const paymentData = (await getFreelancerPaymentDetails(
        user.uid,
      )) as PaymentResponse
      if (typeof paymentData !== 'string') {
        setPaymentInfo(paymentData)
      }

      setOpen(false)
    } catch (error) {
      console.error('Error:', error)
      throw error
    } finally {
      setQrUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Payment Settings
              </h1>
              <p className="text-gray-600 mt-2 text-lg">
                Manage your payment methods securely
              </p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  className="bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  onClick={() => setOpen(true)}
                >
                  + Add Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white text-gray-900 p-8 rounded-xl shadow-lg border border-gray-200">
                <DialogTitle className="text-center text-2xl font-bold mb-6 text-gray-900">
                  Payment Method
                </DialogTitle>

                {/* Tab Navigation */}
                <div className="flex gap-3 mb-6 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('upi')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === 'upi'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Image src={upi} alt="UPI" className="w-5 h-5" />
                      UPI
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab('qr')}
                    className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                      activeTab === 'qr'
                        ? 'bg-black text-white shadow-md'
                        : 'text-gray-700 hover:text-gray-900'
                    }`}
                  >
                    QR Code
                  </button>
                </div>

                {/* UPI Tab */}
                {activeTab === 'upi' && (
                  <form
                    onSubmit={handleSubmitUpi(onSubmitUpi)}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label
                        htmlFor="upiId"
                        className="text-sm font-semibold text-gray-700"
                      >
                        UPI ID
                      </Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@bankname"
                        className="h-12 border-2 border-gray-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-100 rounded-lg bg-gray-50 text-gray-900 placeholder-gray-400 transition-all"
                        {...registerUpi('upiId', {
                          required: 'UPI ID is required',
                          pattern: {
                            value: /^[a-zA-Z0-9._-]+@[a-zA-Z]{3,}$/,
                            message:
                              'Please enter a valid UPI ID (e.g., name@bankname)',
                          },
                        })}
                      />
                      {errorsUpi.upiId?.message && (
                        <p className="text-red-600 text-sm font-medium">
                          {String(errorsUpi.upiId.message)}
                        </p>
                      )}
                    </div>

                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                      <p className="text-xs text-gray-700">
                        <span className="font-semibold">ℹ️ Note:</span> Your UPI
                        ID is used for direct payments
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 bg-black hover:bg-gray-900 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all border border-gray-600"
                    >
                      Save UPI ID
                    </Button>
                  </form>
                )}

                {/* QR Code Tab */}
                {activeTab === 'qr' && (
                  <div className="space-y-5">
                    <QRCodeUpload
                      onUpload={handleQRUpload}
                      currentQRUrl={paymentInfo?.qrCode?.value?.fileUrl}
                      isLoading={qrUploading}
                    />
                    <p className="text-xs text-gray-400 text-center">
                      Upload your UPI QR code for quick payments
                    </p>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Profile and Payment Methods */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Profile Info
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : userProfile ? (
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="relative w-28 h-28 rounded-full overflow-hidden bg-gray-300 border-4 border-white shadow-lg">
                    {userProfile.profilePicture ? (
                      <Image
                        src={userProfile.profilePicture}
                        alt={userProfile.name || 'User'}
                        className="w-full h-full object-cover"
                        width={112}
                        height={112}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black text-white text-3xl font-bold">
                        {getInitials(userProfile.name || '')}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {userProfile.name}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {userProfile.email}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-40">
                <p className="text-gray-600 font-medium">
                  Please login to view your profile
                </p>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm hover:shadow-lg transition-all">
            <h2 className="text-lg font-bold text-gray-900 mb-6">
              Payment Methods
            </h2>
            {paymentLoading ? (
              <div className="flex justify-center items-center h-40">
                <Spinner />
              </div>
            ) : paymentInfo ? (
              <div className="space-y-4">
                {paymentInfo.upiDetails &&
                  typeof paymentInfo.upiDetails.value === 'string' && (
                    <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <Image src={upi} alt="UPI" className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">UPI ID</p>
                          <p className="text-sm text-gray-700 font-medium">
                            {paymentInfo.upiDetails.value}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400" />
                    </div>
                  )}

                {paymentInfo.qrCode &&
                  typeof paymentInfo.qrCode.value === 'object' && (
                    <div className="flex items-start justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-lg transition-all">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                          <span className="text-lg">📱</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">QR Code</p>
                          <p className="text-xs text-gray-600 mt-1">
                            Uploaded{' '}
                            {paymentInfo.qrCode.value.uploadedAt
                              ? new Date(
                                  paymentInfo.qrCode.value.uploadedAt,
                                ).toLocaleDateString()
                              : 'recently'}
                          </p>
                        </div>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-400 shrink-0" />
                    </div>
                  )}

                {!paymentInfo.upiDetails && !paymentInfo.qrCode && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                    <p className="text-gray-700 font-medium mb-4">
                      No payment methods added
                    </p>
                    <Button
                      className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all border border-gray-600"
                      onClick={() => setOpen(true)}
                    >
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                <p className="text-gray-700 font-medium mb-4">
                  No payment methods added
                </p>
                <Button
                  className="bg-black hover:bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all border border-gray-600"
                  onClick={() => setOpen(true)}
                >
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#111827',
            border: '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  )
}
