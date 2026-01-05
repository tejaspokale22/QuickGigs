import { doc, setDoc } from 'firebase/firestore'
import { firestore } from '../firebase'
import {
  collection,
  getDocs,
  updateDoc,
  query,
  where,
} from 'firebase/firestore'
import { storage, appwriteID } from '../appwrite'

export async function saveUpiId(userId: string, upiId: string) {
  try {
    if (!userId || !upiId) {
      throw new Error('User ID and UPI ID are required')
    }

    const paymentRef = doc(firestore, 'payments', userId)
    await setDoc(paymentRef, { userId, upiId }, { merge: true })

    return { success: true, message: 'UPI ID saved successfully' }
  } catch (error) {
    console.error('Error saving UPI ID:', error)
    throw new Error('Failed to save UPI ID.')
  }
}

export async function saveQRCode(userId: string, qrFile: File) {
  try {
    if (!userId || !qrFile) {
      throw new Error('User ID and QR code file are required')
    }

    const bucketId = process.env.NEXT_PUBLIC_APPWRITE_QR_BUCKET_ID
    if (!bucketId) {
      throw new Error('QR bucket ID not configured')
    }

    // Upload file to Appwrite
    const fileId = appwriteID.unique()
    const uploadedFile = await storage.createFile(bucketId, fileId, qrFile)

    // Generate file URL (Appwrite SDK already includes endpoint and project)
    const fileUrl = storage.getFileView(bucketId, fileId)

    // Save to Firestore
    const paymentRef = doc(firestore, 'payments', userId)
    await setDoc(
      paymentRef,
      {
        userId,
        qrCode: {
          fileId: uploadedFile.$id,
          fileUrl: fileUrl,
          uploadedAt: new Date().toISOString(),
        },
      },
      { merge: true },
    )

    return {
      success: true,
      message: 'QR code uploaded successfully',
      data: { fileId: uploadedFile.$id, fileUrl },
    }
  } catch (error) {
    console.error('Error saving QR code:', error)
    throw new Error(
      error instanceof Error ? error.message : 'Failed to save QR code',
    )
  }
}

// Get freelancer payment details
export const getFreelancerPaymentDetails = async (freelancerId: string) => {
  try {
    // Query the payments collection where userId matches the freelancerId
    const paymentsQuery = query(
      collection(firestore, 'payments'),
      where('userId', '==', freelancerId),
    )

    const querySnapshot = await getDocs(paymentsQuery)
    if (querySnapshot.empty) {
      return 'No payment details found for this freelancer.'
    }

    let upiDetails = null
    let qrCode = null

    querySnapshot.forEach((doc) => {
      const data = doc.data()
      if (data.upiId) {
        upiDetails = { type: 'UPI', value: data.upiId }
      }
      if (data.qrCode) {
        qrCode = {
          type: 'QR',
          value: {
            fileId: data.qrCode.fileId,
            fileUrl: data.qrCode.fileUrl,
            uploadedAt: data.qrCode.uploadedAt,
          },
        }
      }
    })

    const paymentDetails = {
      upiDetails: upiDetails,
      qrCode: qrCode,
    }

    if (!upiDetails && !qrCode) {
      return 'No valid payment details found.'
    }

    return paymentDetails
  } catch (error) {
    console.error('Error fetching freelancer payment details:', error)
    throw new Error('Failed to retrieve payment details.')
  }
}

//Approve Payment Status
export const approvePayment = async (gigId: string): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      paymentStatus: true,
    })

    return 'Payment has been successfully approved!.'
  } catch (error) {
    console.error('Error approving the payment:', error)
    throw new Error('Failed to approve the payment.')
  }
}
