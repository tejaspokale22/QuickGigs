"use client";

import React, { useEffect, useState } from "react";
import { fetchGigs } from "../utils/actions/gigActions";
import { fetchUsers } from "../utils/actions/authActions";
import { Check, ChevronRightIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { Gig, User } from "../utils/types";
import { formatDeadline } from "../utils/utilityFunctions";
import { applyForGig } from "../utils/actions/gigActions";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

// Gig Card Component
const GigCard = ({ gig, user }: { gig: Gig; user?: User }) => {
  const [id, setId] = useState<string>("");
  const [applied, setApplied] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  // Get the current user's ID from localStorage
  useEffect(() => {
    const userId = localStorage.getItem("uid") || "";
    setId(userId);

    // Check if the user has already applied for the gig
    if (gig.appliedFreelancers?.includes(userId)) {
      setApplied(true);
    }
  }, [gig.appliedFreelancers]);

  // Handle Apply Button Click (Confirmation Dialog)
  const handleApplyConfirm = async () => {
    try {
      await applyForGig(gig.id, id); // Apply for the gig with the user ID
      setApplied(true); // Set the applied state to true
      setShowDialog(false); // Close the dialog
    } catch (error) {
      console.error("Error applying for the gig:", error);
    }
  };

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
                    href={`/gig/${gig.id}`}
                    className="text-blue-600 hover:underline text-base ml-1"
                  >
                    Read more
                  </Link>
                </>
              ) : (
                <>
                  {gig.description}...
                  <Link
                    href={`/gig/${gig.id}`}
                    className="text-blue-600 hover:underline text-base ml-1"
                  >
                    Read more
                  </Link>
                </>
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

      {/* Deadline Information */}
      <div className="flex justify-between mt-6">
        <p className="font-bold text-sm flex items-end">
          Deadline: <span className="ml-1 text-red-600">{formatDeadline(gig.deadline)}</span>
        </p>

        {/* Apply Button with Confirmation Dialog */}
        {gig.clientId !== id && (
          <>
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className="w-32 rounded bg-black text-white hover:bg-black text-base"
                  disabled={applied}
                >
                  <span className="group inline-flex items-center">
                    {applied ? (
                      <>
                        Applied
                        <Check className="ml-2 size-6 transition-transform duration-300 group-hover:translate-x-0" />
                      </>
                    ) : (
                      <>
                        Apply
                        <ChevronRightIcon
                          strokeWidth={3}
                          className="ml-2 size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white text-black">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to apply for this gig? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button variant="outline" onClick={() => setShowDialog(false)} className="rounded">
                    Cancel
                  </Button>
                  <Button
                    className="bg-black text-white hover:bg-gray-800 rounded"
                    onClick={handleApplyConfirm}
                  >
                    Yes, Apply
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </div>
    </div>
  );
};

// Page Component (Main View for Gigs)
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
    <div className="w-full flex flex-col items-center mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800">Available Gigs</h1>

      {/* Loading State */}
      {loading ? (
        <p>Loading gigs...</p>
      ) : (
        <div className="grid grid-cols-2 justify-center gap-1 mx-auto">
          {gigs.map((gig) => {
            const user = users.find((user) => user.uid === gig.clientId);
            return <GigCard key={gig.id} gig={gig} user={user} />;
          })}
        </div>
      )}
    </div>
  );
};

export default Page;
