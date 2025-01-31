"use client";
import React, { useEffect, useState } from "react";
import { fetchUser } from "../utils/actions/authActions";
import ContactDialog from "@/components/profile/ContactDialog";
import LocationDialog from "@/components/profile/LocationDialog";
import BioDialog from "@/components/profile/BioDialog";
import SkillsDialog from "@/components/profile/SkillsDialog";
import SocialsDialog from "@/components/profile/SocialsDialog";
import ExperienceDialog from "@/components/profile/ExperienceDialog";
import Link from "next/link"; 
import Website from "../../../public/globe.svg";
import Linkedin from "../../../public/linkedin.svg";
import Instagram from "../../../public/instagram.svg";
import Github from "../../../public/github.svg";
import X from "../../../public/X.svg";
import Image from 'next/image';
import { Phone, MapPin, User, Star, Link2, Briefcase, Mail } from 'lucide-react';
import {Spinner} from "@heroui/spinner";

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
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [bioDialogOpen, setBioDialogOpen] = useState(false);
  const [skillsDialogOpen, setSkillsDialogOpen] = useState(false);
  const [socialsDialogOpen, setSocialsDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [useClipLoader, setUseClipLoader] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (!uid) {
      console.error("No user ID found in localStorage");
      return;
    }

    const fetchUserData = async () => {
      try {
        const user = await fetchUser(uid);
        console.log(user);
        if (user) {
          const userProfile: UserProfile = {
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture || "",
            contact: user.contact || '',
            location: user.location || '',
            bio: user.bio || '',
            skills: user.skills || [],
            socials: user.socials || { github: '', twitter: '', linkedin: '', instagram: '', website: '' },
            experience: user.experience || '',
          };
          setUserData(userProfile);
        } else {
          console.error("User not found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size='lg' color="primary"/>
      </div>
    );
  }

  return (
    <div className="w-full p-8 mt-10 rounded-xl h-5/6 bg-gray-100 flex flex-col gap-4 max-w-3xl mx-auto">
    
      <div className="flex items-center space-x-4">
        <Image
          src={userData.profilePicture}
          alt="Profile Picture"
          className="rounded-full object-contain"
          width={80}
          height={1}
        />
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-blue-600 flex items-center">
            <Mail className="w-4 h-4 mr-1" />
            {userData.email}
          </p>
        </div>
      </div>

      <div className="flex gap- items-center justify-start pt-8">
        <div className="flex items-center flex-col mb-4">
          {/* Contact Section */}
          <div className="flex items-center space-x-2">
            <Phone className="w-5 h-5" strokeWidth={2} />
            <h2 className="text-xl font-semibold">Contact</h2>
          </div>
          {!userData.contact && (
            <button onClick={() => setContactDialogOpen(true)} className="text-blue-500">
              Add Contact
            </button>
          )}
          <p>+91 {userData.contact || "Not provided"}</p>
        </div>

        <div className="flex items-center flex-col mb-4">
          {/* Location Section */}
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" strokeWidth={2} />
            <h2 className="text-xl font-semibold">Location</h2>
          </div>
          {!userData.location && (
            <button onClick={() => setLocationDialogOpen(true)} className="text-blue-500">
              Add Location
            </button>
          )}
          <p>{userData.location || "Not provided"}</p>
        </div>

        <div className="flex items-center flex-col mb-4">
          {/* Socials Section */}
          <div className="flex items-center space-x-2">
            <Link2 className="w-5 h-5" strokeWidth={2} />
            <h2 className="text-xl font-semibold">Socials</h2>
          </div>
          {(!userData.socials?.github && !userData.socials?.twitter && !userData.socials?.linkedin && !userData.socials?.instagram && !userData.socials?.website) && (
            <button onClick={() => setSocialsDialogOpen(true)} className="text-blue-500">
              Add Socials
            </button>
          )}
          <div className="mt-2 flex space-x-4">
            {/* Social Links */}
            {userData.socials?.website && (
              <Link href={userData.socials.website} target="_blank" className="text-gray-600 hover:text-gray-900">
                <Image src={Website} alt="Website" width={24} height={24} />
              </Link>
            )}
            {userData.socials?.linkedin && (
              <Link href={userData.socials.linkedin} target="_blank" className="text-gray-600 hover:text-gray-900">
                <Image src={Linkedin} alt="LinkedIn" width={24} height={24} />
              </Link>
            )}
            {userData.socials?.github && (
              <Link href={userData.socials.github} target="_blank" className="text-gray-600 hover:text-gray-900">
                <Image src={Github} alt="Github" width={24} height={24} />
              </Link>
            )}
            {userData.socials?.instagram && (
              <Link href={userData.socials.instagram} target="_blank" className="text-gray-600 hover:text-gray-900">
                <Image src={Instagram} alt="Instagram" width={24} height={24} />
              </Link>
            )}
            {userData.socials?.twitter && (
              <Link href={userData.socials.twitter} target="_blank" className="text-gray-600 hover:text-gray-900">
                <Image src={X} alt="Twitter" width={24} height={24} />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* About Me Section */}
      <div className="mt-2">
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5" strokeWidth={2} />
          <h2 className="text-xl font-semibold">About Me</h2>
        </div>
        {!userData.bio && (
          <button onClick={() => setBioDialogOpen(true)} className="text-blue-500">
            Add Bio
          </button>
        )}
        <p className="mt-1">{userData.bio || "Not provided"}</p>
      </div>

      {/* Skills Section */}
      <div className="mt-6">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5" strokeWidth={2} />
          <h2 className="text-xl font-semibold">Skills</h2>
        </div>
        {userData.skills && userData.skills.length === 0 && (
          <button onClick={() => setSkillsDialogOpen(true)} className="text-blue-500">
            Add Skills
          </button>
        )}
        <ul className="mt-3 space-y-2 space-x-3">
          {(userData.skills || []).map((skill, index) => (
            <li key={index} className="text-black bg-gray-300 p-2 inline rounded">{skill}</li>
          ))}
        </ul>
      </div>

      {/* Experience Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5" strokeWidth={2} />
            <h2 className="text-xl font-semibold">Experience</h2>
          </div>
          {!userData.experience && (
            <button onClick={() => setExperienceDialogOpen(true)} className="text-blue-500">
              Add Experience
            </button>
          )}
        </div>
        <p className="mt-1 text-black rounded">
          {userData.experience || "No experience provided."}
        </p>
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
  );
};

export default ProfilePage;
