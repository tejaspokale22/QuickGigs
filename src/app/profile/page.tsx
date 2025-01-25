"use client";

import { useEffect, useState } from "react";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from "next/image";

const Profile: React.FC = () => {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userUid = localStorage.getItem("uid"); // Get UID from local storage
      if (!userUid) {
        setError("User UID not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const userData = await fetchUser(userUid); // Use the action
        setUserInfo(userData);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="profile-page p-6 bg-white rounded-md shadow-md">
      <h1 className="text-2xl font-bold text-center">Profile</h1>
      {userInfo && (
        <div className="profile-info mt-6 flex flex-col items-center">
          <div className="profile-image mb-4">
            <Image
              src={userInfo.profilePicture || "/default-profile.jpg"}
              alt="Profile Image"
              width={150}
              height={150}
              className="rounded-full"
            />
          </div>
          <div className="profile-details text-center">
            <h2 className="text-xl font-semibold">{userInfo.name}</h2>
            <p className="text-sm text-gray-500">{userInfo.email}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
