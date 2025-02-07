import { Client, Storage, ID } from 'appwrite'

const client = new Client()

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Appwrite endpoint
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!) // Project ID

export const storage = new Storage(client)
export const appwriteID = ID
