"use client";
import React, { useEffect, useState } from "react";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from "next/navigation";
import { Mail, Phone, Link2, Briefcase, MapPin, User, Copy, Check } from 'lucide-react';
import Website from '../../../../public/globe.svg';
import Linkedin from '../../../../public/linkedin.svg';
import Instagram from '../../../../public/instagram.svg';
import Github from '../../../../public/github.svg';
import X from '../../../../public/X.svg';
import { copyToClipboard } from "@/app/utils/utilityFunctions";
import Spinner from "@/components/ui/spinner";

interface UserProfile {
  name: string;
  email: string;
  profilePicture: string;
  contact?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    website?: string;
  };
  experience?: string;
}

const ProfilePage = () => {
  const { slug } = useParams() as { slug: string };
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [clipboardStatus, setClipboardStatus] = useState<boolean>(false);

  const handleClipboard = async (email: string) => {
    try {
      await copyToClipboard(email);
      setClipboardStatus(true);
      setTimeout(() => {
        setClipboardStatus(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy email:', error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUser(slug);
        if (user) {
          const userProfile: UserProfile = {
            name: user.name || 'Anonymous',
            email: user.email || 'No email provided',
            profilePicture: user.profilePicture || '/default-avatar.png',
            contact: user.contact || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: user.skills || [],
            socials: user.socials || { github: '', twitter: '', linkedin: '', instagram: '', website: '' },
            experience: user.experience || '',
          };
          setUserData(userProfile);
        } else {
          setError("User not found");
        }
      } catch (error) {
        setError("Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Spinner />
      </div>
    );
  }

  if (error || !userData) {
    return <div className="text-red-500 text-center">{error || "User data not available"}</div>;
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
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.name}
              </h1>
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <p className="text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </p>
                <button
                  onClick={() => handleClipboard(userData.email)}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  title="Copy email"
                >
                  {clipboardStatus ? (
                    <Check className="w-4 h-4 text-gray-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                  )}
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 justify-center sm:justify-start">
                {userData.skills?.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 rounded-full text-sm font-medium bg-blue-100 border border-blue-900"
                  >
                    {skill}
                  </span>
                ))}
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
                  <p className="text-gray-900">
                    {userData.contact ? `+91 ${userData.contact}` : 'Not provided'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">
                    {userData.location || 'Not provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Social Links Card */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Link2 className="w-5 h-5 text-gray-500" />
                Social Links
              </h2>
              <div className="flex flex-wrap gap-4">
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
                    <Image src={Linkedin} alt="LinkedIn" width={24} height={24} />
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
                    <Image src={Instagram} alt="Instagram" width={24} height={24} />
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
                {!userData.socials?.github && !userData.socials?.linkedin && 
                 !userData.socials?.twitter && !userData.socials?.instagram && 
                 !userData.socials?.website && (
                  <p className="text-gray-500">No social links provided</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Card */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-gray-500" />
                About
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {userData.bio || 'No bio provided'}
              </p>
            </div>

            {/* Experience Card */}
            <div className="bg-gray-100 rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-gray-500" />
                Experience
              </h2>
              <p className="text-gray-700 whitespace-pre-wrap">
                {userData.experience || 'No experience provided'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;