"use client";
import React, { useEffect, useState } from "react";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from 'next/image';
import { useParams } from "next/navigation";

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
  const { slug } = useParams() as { slug: string }; // Get uid from params
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await fetchUser(slug); // Use slug as uid
        console.log(user);
        if (user) {
          const userProfile: UserProfile = {
            name: user.name,
            email: user.email,
            profilePicture: user.profilePicture,
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
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  return (
    <div className="w-full p-8 mt-10 rounded-xl h-5/6 bg-gray-100 flex flex-col gap-4 max-w-3xl mx-auto">
      <div className="flex items-center space-x-4">
        <Image
          src={userData.profilePicture}
          alt="Profile Picture"
          className="rounded-full object-contain"
          width={80}
          height={80}
        />
        <div>
          <h1 className="text-2xl font-bold">{userData.name}</h1>
          <p className="text-blue-600">{userData.email}</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Contact</h2>
        <p>{userData.contact || "Not provided"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Location</h2>
        <p>{userData.location || "Not provided"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Bio</h2>
        <p>{userData.bio || "Not provided"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Skills</h2>
        <p>{userData.skills?.length ? userData.skills.join(", ") : "Not provided"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Experience</h2>
        <p>{userData.experience || "Not provided"}</p>
      </div>

      <div>
        <h2 className="text-lg font-semibold">Socials</h2>
        <p>
          {userData.socials?.github && <a href={userData.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          {userData.socials?.linkedin && <a href={userData.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          {userData.socials?.twitter && <a href={userData.socials.twitter} target="_blank" rel="noopener noreferrer">Twitter</a>}
          {userData.socials?.instagram && <a href={userData.socials.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>}
          {userData.socials?.website && <a href={userData.socials.website} target="_blank" rel="noopener noreferrer">Website</a>}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;