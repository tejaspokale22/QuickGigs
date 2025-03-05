import { format } from 'date-fns'
import { Timestamp } from 'firebase/firestore'

// Utility Functions
export const formatDeadline = (
  deadline: { seconds: number; nanoseconds: number } | null,
): string => {
  if (!deadline || typeof deadline.seconds !== 'number') {
    return 'No deadline'
  }
  const date = new Date(deadline.seconds * 1000)
  return format(date, 'dd MMM yyyy')
}

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    // Use the Clipboard API to copy text
    await navigator.clipboard.writeText(text)
  } catch (error) {
    console.error('Failed to copy text to clipboard:', error)
  }
}

export const getDaysAgo = (firebaseTimestamp: Timestamp) => {
  if (!firebaseTimestamp) return 'Unknown' // Handle missing timestamp

  const gigDate = firebaseTimestamp.toDate() // Convert Firebase Timestamp to JS Date
  const today = new Date()
  const timeDiff = today.getTime() - gigDate.getTime() // Convert to milliseconds
  const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24)) // Convert ms to days

  return daysAgo === 0 ? 'Today' : `${daysAgo} day${daysAgo > 1 ? 's' : ''} ago`
}
