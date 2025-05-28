'use client'
import React, { useEffect, useState } from 'react'
import { fetchUser } from '../utils/actions/authActions'
import ContactDialog from '@/components/profile/ContactDialog'
import LocationDialog from '@/components/profile/LocationDialog'
import BioDialog from '@/components/profile/BioDialog'
import SkillsDialog from '@/components/profile/SkillsDialog'
import SocialsDialog from '@/components/profile/SocialsDialog'
import ExperienceDialog from '@/components/profile/ExperienceDialog'
import Link from 'next/link'
import Website from '../../../public/globe.svg'
import Linkedin from '../../../public/linkedin.svg'
import Instagram from '../../../public/instagram.svg'
import Github from '../../../public/github.svg'
import X from '../../../public/X.svg'
import Image from 'next/image'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/app/utils/firebase'
import {
  Phone,
  User,
  Link2,
  Briefcase,
  Mail,
  Edit,
} from 'lucide-react'
import Spinner from '@/components/ui/spinner'

interface UserProfile {
  name: string
  email: string
  profilePicture: string
  contact?: string
  location?: string
  bio?: string
  skills?: string[]
  socials?: {
    github?: string
    twitter?: string
    linkedin?: string
    instagram?: string
    website?: string
  }
  experience?: string
}

const ProfilePage = () => {
  const [userData, setUserData] = useState<UserProfile | null>(null)
  const [contactDialogOpen, setContactDialogOpen] = useState(false)
  const [locationDialogOpen, setLocationDialogOpen] = useState(false)
  const [bioDialogOpen, setBioDialogOpen] = useState(false)
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false)
  const [socialsDialogOpen, setSocialsDialogOpen] = useState(false)
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false)

  useEffect(() => {
    const uid = localStorage.getItem('uid')
    if (!uid) {
      console.error('No user ID found in localStorage')
      return
    }

    const fetchUserData = (uid: string) => {
      try {
        const userRef = doc(firestore, 'users', uid)

        return onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const user = docSnap.data()
            const userProfile: UserProfile = {
              name: user.name,
              email: user.email,
              profilePicture: user.profilePicture || '',
              contact: user.contact || '',
              location: user.location || '',
              bio: user.bio || '',
              skills: user.skills || [],
              socials: user.socials || {
                github: '',
                twitter: '',
                linkedin: '',
                instagram: '',
                website: '',
              },
              experience: user.experience || '',
            }
            setUserData(userProfile)
          } else {
            console.error('User not found')
          }
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }
    const unsubscribe = fetchUserData(uid)
    return () => unsubscribe && unsubscribe() // Cleanup listener on unmount
  }, [])

  if (!userData) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-gray-100 rounded-2xl shadow-sm p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <Image
                src={userData.profilePicture}
                alt="Profile Picture"
                className="rounded-full object-cover"
                width={120}
                height={120}
              />
              <button
                className="absolute bottom-0 right-0 bg-black text-white p-2 rounded-full hover:bg-gray-800 transition-colors"
                title="Edit profile picture"
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.name}
              </h1>
              <p className="text-gray-600 flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Mail className="w-4 h-4" />
                {userData.email}
              </p>
              <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                {userData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 flex items-center justify-center rounded-full text-sm font-medium transition-all hover:scale-105 bg-blue-100 border border-blue-900`}
                  >
                    {skill}
                  </span>
                ))}
                <button
                  onClick={() => setSkillsDialogOpen(true)}
                  className="px-3 py-1.5 border border-gray-300 text-gray-600 rounded-full text-sm 
                    hover:bg-gray-50 hover:border-gray-400 transition-all font-medium"
                >
                  + Add Skills
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-1 space-y-6">
            {/* Contact Info Card */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-500" />
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      +91 {userData.contact || 'Not provided'}
                    </p>
                    <button
                      onClick={() => setContactDialogOpen(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {userData.contact ? 'Edit' : 'Add'}
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900">
                      {userData.location || 'Not provided'}
                    </p>
                    <button
                      onClick={() => setLocationDialogOpen(true)}
                      className="text-blue-600 hover:text-blue-700 text-sm"
                    >
                      {userData.location ? 'Edit' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-gray-500" />
                  Socials
                </h2>
                <button
                  onClick={() => setSocialsDialogOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Edit
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {userData.socials?.website && (
                  <Link
                    href={userData.socials.website}
                    target="_blank"
                    className="p-2 transition-transform transform hover:scale-110"
                  >
                    <Image src={Website} alt="Website" width={24} height={24} />
                  </Link>
                )}
                {userData.socials?.linkedin && (
                  <Link
                    href={userData.socials.linkedin}
                    target="_blank"
                    className="p-2 transition-transform transform hover:scale-110"
                  >
                    <Image
                      src={Linkedin}
                      alt="LinkedIn"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
                {userData.socials?.github && (
                  <Link
                    href={userData.socials.github}
                    target="_blank"
                    className="p-2 transition-transform transform hover:scale-110"
                  >
                    <Image src={Github} alt="Github" width={24} height={24} />
                  </Link>
                )}
                {userData.socials?.instagram && (
                  <Link
                    href={userData.socials.instagram}
                    target="_blank"
                    className="p-2 transition-transform transform hover:scale-110"
                  >
                    <Image
                      src={Instagram}
                      alt="Instagram"
                      width={24}
                      height={24}
                    />
                  </Link>
                )}
                {userData.socials?.twitter && (
                  <Link
                    href={userData.socials.twitter}
                    target="_blank"
                    className="p-2 transition-transform transform hover:scale-110"
                  >
                    <Image src={X} alt="Twitter" width={24} height={24} />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  About
                </h2>
                <button
                  onClick={() => setBioDialogOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {userData.bio ? 'Edit' : 'Add'}
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">
                {userData.bio || 'Tell others about yourself...'}
              </p>
            </div>

            {/* Experience Section */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-500" />
                  Experience
                </h2>
                <button
                  onClick={() => setExperienceDialogOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  {userData.experience ? 'Edit' : 'Add'}
                </button>
              </div>
              <p className="text-gray-600 whitespace-pre-wrap">
                {userData.experience || 'Share your work experience...'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <ContactDialog
        isOpen={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
      />
      <LocationDialog
        isOpen={locationDialogOpen}
        onClose={() => setLocationDialogOpen(false)}
      />
      <BioDialog
        isOpen={bioDialogOpen}
        onClose={() => setBioDialogOpen(false)}
      />
      <SkillsDialog
        isOpen={skillsDialogOpen}
        onClose={() => setSkillsDialogOpen(false)}
      />
      <SocialsDialog
        isOpen={socialsDialogOpen}
        onClose={() => setSocialsDialogOpen(false)}
      />
      <ExperienceDialog
        isOpen={experienceDialogOpen}
        onClose={() => setExperienceDialogOpen(false)}
      />
    </div>
  )
}

export default ProfilePage
