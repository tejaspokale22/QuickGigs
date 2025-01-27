"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchGigs } from "../utils/actions/gigActions";
import { fetchUsers } from "../utils/actions/authActions";
import { format } from "date-fns";
import { ArrowRightToLine } from "lucide-react";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";

// Types
type Gig = {
  title: string;
  description: string;
  skillsRequired: string[];
  price: number;
  deadline: Timestamp;
  status: string;
  clientId: string;
  createdAt: Timestamp;
};

type User = {
  uid: string;
  name: string;
  email: string;
  profilePicture?: string;
};

// Utility Functions
const formatDeadline = (deadline: { seconds: number; nanoseconds: number } | null): string => {
  if (!deadline || typeof deadline.seconds !== "number") {
    return "No deadline";
  }
  const date = new Date(deadline.seconds * 1000);
  return format(date, "dd MMM yyyy");
};

//Gig Card
const GigCard = ({ gig, user }: { gig: Gig; user?: User }) => {
  return (
    <div className="border p-4 rounded bg-white flex flex-col border-gray-400 w-11/12">
      {/* User Information */}
      {user && (
        <div className="flex justify-between">
          <div className="flex items-center mb-4">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.name}
              className="w-12 h-12 rounded-full mr-2"
            />
            <div>
              <p className="text-lg font-semibold text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="text-black">
            <span className="text-base font-semibold mr-1">Payout:</span>
            <span className="text-lg">₹</span>{gig.price}
          </div>
        </div>
      )}

      {/* Gig Information */}
      <div className="flex justify-between">
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800 mb-1">{gig.title}</h2>
          <p className="text-lg font-semibold text-black mb-1">
            Details:{" "}
            <span className="text-md font-thin">
              {gig.description.split(" ").length > 16 ? (
                <>
                  {gig.description.split(" ").slice(0, 12).join(" ")}...
                  <Link
                    href={`/gig/${gig.title}`} // Replace this with the appropriate route for your "Read More" page
                    className="text-blue-600 hover:underline text-base ml-1"
                  >
                    Read more
                  </Link>
                </>
              ) : (
                <>{gig.description}...<Link
                href={`/gig/${gig.title}`} // Replace this with the appropriate route for your "Read More" page
                className="text-blue-600 hover:underline text-base ml-1"
              >
                Read more
              </Link></>
              )}
            </span>
          </p>
          <div className="mb-4 flex gap-2 flex-col">
            <p className="text-black font-semibold">Skills Required:</p>
            <div className="flex gap-2">
              {gig.skillsRequired.map((skill) => (
                <div key={skill} className="bg-gray-200 text-black rounded-full p-2 px-3">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between mt-6">
        <p className="font-bold text-sm flex items-end">
          Deadline:<span className="ml-1 text-red-600">{formatDeadline(gig.deadline)}</span>
        </p>
        <Button className="text-black border bg-green-300 hover:bg-green-400 rounded">
          Apply <ArrowRightToLine />
        </Button>
      </div>
    </div>
  );
};


const Page = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch Gigs and Users on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const gigsData: Gig[] = await fetchGigs();
        setGigs(gigsData);

        const usersData: User[] = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="max-w-4xl flex flex-col items-center mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Available Gigs</h1>

      {/* Loading State */}
      {loading ? (
        <p>Loading gigs...</p>
      ) : (
        <div className="grid grid-cols-1 justify-center gap-4 mx-auto">
          {gigs.map((gig) => {
            const user = users.find((user) => user.uid === gig.clientId);
            return <GigCard key={gig.title} gig={gig} user={user} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
