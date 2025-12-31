import { firestore } from '../firebase'
import {
  collection,
  doc,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
} from 'firebase/firestore'
import { Timestamp } from 'firebase/firestore'
import { Gig } from '../types'
import { storage } from '../appwrite'
import { ID } from 'appwrite'

// Function to upload files to Appwrite and post a gig to Firestore
export const postGig = async (
  gigData: Omit<Gig, 'id'>,
  selectedFiles: File[],
) => {
  try {
    // Initialize attachments array
    const attachments = []

    // Upload each file to Appwrite Storage
    for (const file of selectedFiles) {
      const uploadedFile = await storage.createFile(
        process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID!,
        ID.unique(),
        file,
      )
      console.log(uploadedFile)

      // Construct file metadata
      const fileData = {
        fileId: uploadedFile.$id,
        fileName: file.name,
        fileUrl: `https://cloud.appwrite.io/v1/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`,
        fileType: file.type,
        uploadedAt: Timestamp.now(),
      }

      attachments.push(fileData)
    }

    // Prepare gig data for Firestore
    const gigPayload = {
      ...gigData,
      attachments, // Store formatted attachments
    }

    // Store gig in Firestore
    await addDoc(collection(firestore, 'gigs'), gigPayload)

    return 'Gig posted successfully!'
  } catch (error) {
    console.error('Error posting gig:', error)
  }
}

// Fetch all Gigs
export const fetchGigs = async (): Promise<Gig[]> => {
  try {
    const gigsCollectionRef = collection(firestore, 'gigs')
    const gigsSnapshot = await getDocs(gigsCollectionRef)
    const gigsList = gigsSnapshot.docs
      .map((doc) => {
        const data = doc.data() as Omit<Gig, 'id'>
        return {
          id: doc.id,
          ...data,
        }
      })
      .filter((gig) => gig.status === 'pending') // Filter gigs with status "pending"

    return gigsList
  } catch (error) {
    console.error('Error fetching gigs:', error)
    throw new Error('Failed to fetch gigs')
  }
}

// Fetch a Gig by ID
export const fetchGigById = async (gigId: string): Promise<Gig | null> => {
  try {
    const gigDocRef = doc(firestore, 'gigs', gigId)
    const gigDoc = await getDoc(gigDocRef)

    if (gigDoc.exists()) {
      return { id: gigDoc.id, ...gigDoc.data() } as Gig
    } else {
      console.warn('Gig not found.')
      return null
    }
  } catch (error) {
    console.error('Error fetching gig by ID:', error)
    throw new Error('Failed to fetch gig by ID')
  }
}

export const fetchGigsByClientId = async (clientId: string): Promise<Gig[]> => {
  if (!clientId) {
    throw new Error('Client ID is required to fetch gigs.')
  }

  try {
    // Reference the gigs collection
    const gigsRef = collection(firestore, 'gigs')

    // Query gigs where clientId matches the given clientId
    const q = query(gigsRef, where('clientId', '==', clientId))

    // Fetch the documents
    const querySnapshot = await getDocs(q)

    // Map the documents into Gig objects
    const gigs: Gig[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Gig[]

    return gigs
  } catch (error) {
    console.error('Error fetching gigs by client ID:', error)
    throw new Error('Failed to fetch gigs. Please try again later.')
  }
}

// Function to handle the application of a freelancer
export const applyForGig = async (gigId: string, freelancerId: string) => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    // Check if freelancer already applied
    const gigDoc = await getDoc(gigRef)
    if (gigDoc.exists()) {
      const gigData = gigDoc.data()
      const appliedFreelancers = gigData?.appliedFreelancers || []

      // If freelancer ID is already in the array, prevent further update
      if (appliedFreelancers.includes(freelancerId)) {
        console.log('Freelancer has already applied.')
        return
      }

      // Update appliedFreelancers array atomically to avoid race conditions
      await updateDoc(gigRef, {
        appliedFreelancers: arrayUnion(freelancerId),
      })
      console.log('Freelancer applied successfully!')
    } else {
      console.log('Gig not found.')
    }
  } catch (error) {
    console.error('Error applying for gig:', error)
  }
}

//Fetch Assigned Gigs
export const getAssignedGigs = async (userId: string): Promise<Gig[]> => {
  try {
    console.log('Fetching gigs for userId:', userId) // Debugging

    const gigsCollectionRef = collection(firestore, 'gigs')
    const gigsQuery = query(
      gigsCollectionRef,
      where('freelancerId', '==', userId),
    )
    const gigsSnapshot = await getDocs(gigsQuery)

    console.log('Gigs snapshot size:', gigsSnapshot.size) // Check if data is fetched

    if (gigsSnapshot.empty) {
      console.log('No assigned gigs found.')
      return []
    }

    const gigs: Gig[] = gigsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Gig[]

    console.log('Fetched gigs:', gigs)
    return gigs
  } catch (error) {
    console.error('Error fetching assigned gigs:', error)
    throw new Error('Failed to fetch assigned gigs')
  }
}

//Assign Gig to a Freelancer
export const updateGigFreelancer = async (
  gigId: string,
  freelancerId: string,
): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      freelancerId: freelancerId,
    })

    return 'Freelancer assigned successfully!'
  } catch (error) {
    console.error('Error updating gig:', error)
    throw new Error('Failed to assign freelancer.')
  }
}

//Reject a Gig Request
export const rejectGig = async (gigId: string): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      freelancerId: '',
    })

    return 'Gig has been successfully rejected.'
  } catch (error) {
    console.error('Error rejecting gig:', error)
    throw new Error('Failed to reject gig.')
  }
}

//Accept a Gig Request
export const acceptGig = async (gigId: string): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      status: 'progress',
    })

    return 'Gig has been successfully accepted.'
  } catch (error) {
    console.error('Error accepting gig:', error)
    throw new Error('Failed to accept gig.')
  }
}

//Mark the gig as completed
export const markAsCompleted = async (gigId: string): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      status: 'completed',
    })

    return 'Gig has been successfully completed.'
  } catch (error) {
    console.error('Error marking gig as completed:', error)
    throw new Error('Failed to mark gig as completed.')
  }
}

//Approve gig work
export const approve = async (gigId: string): Promise<string> => {
  try {
    const gigRef = doc(firestore, 'gigs', gigId)

    await updateDoc(gigRef, {
      workStatus: true,
    })

    return 'Gig has been successfully approved.'
  } catch (error) {
    console.error('Error approving the gig:', error)
    throw new Error('Failed to approve the gig.')
  }
}
