'use client'
import React, { useEffect, useState } from 'react'
import { fetchUser } from '@/utils/actions/authActions'
import ContactDialog from '@/components/profile/ContactDialog'
import LocationDialog from '@/components/profile/LocationDialog'
import BioDialog from '@/components/profile/BioDialog'
import SkillsDialog from '@/components/profile/SkillsDialog'
import SocialsDialog from '@/components/profile/SocialsDialog'
import ExperienceDialog from '@/components/profile/ExperienceDialog'
import Link from 'next/link'
import Website from '@/../public/globe.svg'
import Linkedin from '@/../public/linkedin.svg'
import Instagram from '@/../public/instagram.svg'
import Github from '@/../public/github.svg'
import X from '@/../public/X.svg'
import Image from 'next/image'
import { doc, onSnapshot } from 'firebase/firestore'
import { firestore } from '@/utils/firebase'
import { Phone, User, Link2, Briefcase, Mail, Edit, MapPin } from 'lucide-react'
import Spinner from '@/components/ui/spinner'
import { useAuth } from '@/context/AuthContext'

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
  const { user } = useAuth()

  useEffect(() => {
    if (!user?.uid) return

    const userRef = doc(firestore, 'users', user.uid)

    const unsubscribe = onSnapshot(
      userRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          console.error('User document not found')
          return
        }

        const data = docSnap.data()

        const userProfile: UserProfile = {
          name: data.name ?? '',
          email: data.email ?? '',
          profilePicture: data.profilePicture ?? '',
          contact: data.contact ?? '',
          location: data.location ?? '',
          bio: data.bio ?? '',
          skills: data.skills ?? [],
          socials: data.socials ?? {
            github: '',
            twitter: '',
            linkedin: '',
            instagram: '',
            website: '',
          },
          experience: data.experience ?? '',
        }

        setUserData(userProfile)
      },
      (error) => {
        console.error('Error listening to user data:', error)
      },
    )

    return () => unsubscribe()
  }, [user?.uid])

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 items-center justify-center flex pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-64">
            <Spinner />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
            {/* Avatar Section */}
            <div className="relative shrink-0">
              <div className="relative w-32 h-32">
                <Image
                  src={userData.profilePicture}
                  alt={userData.name}
                  className="rounded-full object-cover w-full h-full border-4 border-black"
                  width={128}
                  height={128}
                />
                <button
                  className="absolute bottom-0 right-0 bg-black text-white p-3 rounded-full cursor-pointer"
                  title="Edit profile picture"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Profile Info Section */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {userData.name}
              </h1>
              <p className="text-gray-700 flex items-center justify-center sm:justify-start gap-2 mb-4">
                <Mail className="w-4 h-4 text-gray-800" />
                {userData.email}
              </p>

              {/* Skills Section */}
              <div className="mt-6">
                <p className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  {userData.skills && userData.skills.length > 0 ? (
                    <>
                      {userData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-900 border border-gray-200 hover:bg-gray-200 transition-all"
                        >
                          {skill}
                        </span>
                      ))}
                      <button
                        onClick={() => setSkillsDialogOpen(true)}
                        className="px-4 py-2 rounded-full text-sm font-medium border border-gray-300 text-gray-800 hover:bg-gray-100 hover:border-gray-400 transition-all cursor-pointer"
                      >
                        + Edit
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setSkillsDialogOpen(true)}
                      className="px-4 py-2 rounded-full text-sm font-medium border border-dashed border-gray-400 text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
                    >
                      + Add Skills
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Quick Info */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Phone className="w-5 h-5 text-gray-800" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Contact</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Phone
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-gray-900 font-medium">
                      {userData.contact
                        ? `+91 ${userData.contact}`
                        : 'Not added'}
                    </p>
                    <button
                      onClick={() => setContactDialogOpen(true)}
                      className="text-gray-900 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {userData.contact ? 'Edit' : 'Add'}
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-1">
                    Location
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">
                        {userData.location || 'Not added'}
                      </p>
                    </div>
                    <button
                      onClick={() => setLocationDialogOpen(true)}
                      className="text-gray-900 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                    >
                      {userData.location ? 'Edit' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Socials Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Link2 className="w-5 h-5 text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Connect
                  </h3>
                </div>
                <button
                  onClick={() => setSocialsDialogOpen(true)}
                  className="text-gray-900 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
              <div className="flex gap-3 flex-wrap">
                {userData.socials?.website && (
                  <Link
                    href={userData.socials.website}
                    target="_blank"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Image src={Website} alt="Website" width={20} height={20} />
                  </Link>
                )}
                {userData.socials?.linkedin && (
                  <Link
                    href={userData.socials.linkedin}
                    target="_blank"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src={Linkedin}
                      alt="LinkedIn"
                      width={20}
                      height={20}
                    />
                  </Link>
                )}
                {userData.socials?.github && (
                  <Link
                    href={userData.socials.github}
                    target="_blank"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Image src={Github} alt="Github" width={20} height={20} />
                  </Link>
                )}
                {userData.socials?.instagram && (
                  <Link
                    href={userData.socials.instagram}
                    target="_blank"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Image
                      src={Instagram}
                      alt="Instagram"
                      width={20}
                      height={20}
                    />
                  </Link>
                )}
                {userData.socials?.twitter && (
                  <Link
                    href={userData.socials.twitter}
                    target="_blank"
                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Image src={X} alt="Twitter" width={20} height={20} />
                  </Link>
                )}
                {!userData.socials?.website &&
                  !userData.socials?.linkedin &&
                  !userData.socials?.github &&
                  !userData.socials?.instagram &&
                  !userData.socials?.twitter && (
                    <p className="text-sm text-gray-500 italic">
                      No links added
                    </p>
                  )}
              </div>
            </div>
          </div>

          {/* Right Column - Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <User className="w-5 h-5 text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    About Me
                  </h3>
                </div>
                <button
                  onClick={() => setBioDialogOpen(true)}
                  className="text-gray-900 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  {userData.bio ? 'Edit' : 'Add'}
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                {userData.bio ||
                  'Write something about yourself to help clients understand your background and expertise...'}
              </p>
            </div>

            {/* Experience Section */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Briefcase className="w-5 h-5 text-gray-800" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Experience
                  </h3>
                </div>
                <button
                  onClick={() => setExperienceDialogOpen(true)}
                  className="text-gray-900 hover:text-black text-xs font-semibold transition-colors cursor-pointer"
                >
                  {userData.experience ? 'Edit' : 'Add'}
                </button>
              </div>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-base">
                {userData.experience ||
                  'Share your professional experience, projects, and achievements...'}
              </p>
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
    </div>
  )
}

export default ProfilePage
