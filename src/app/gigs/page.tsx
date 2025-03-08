"use client";

import React, { useEffect, useState } from "react";
import { fetchGigs } from "../utils/actions/gigActions";
import { fetchUsers } from "../utils/actions/authActions";
import { Check, ChevronRightIcon} from "lucide-react";
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
import { firestore } from "@/app/utils/firebase";
import { onSnapshot, collection} from "firebase/firestore";
import { getDaysAgo } from "../utils/utilityFunctions";

// Gig Card Component
const GigCard = ({ gig, user }: { gig: Gig; user?: User }) => {
  const [id, setId] = useState<string>("");
  const [applied, setApplied] = useState<boolean>(false);
  const [showDialog, setShowDialog] = useState<boolean>(false);

  useEffect(() => {
    const userId = localStorage.getItem("uid") || "";
    setId(userId);
    if (gig.appliedFreelancers?.includes(userId)) {
      setApplied(true);
    }
  }, [gig.appliedFreelancers]);

  const handleApplyConfirm = async () => {
    try {
      await applyForGig(gig.id, id);
      setApplied(true);
      setShowDialog(false);
    } catch (error) {
      console.error("Error applying for the gig:", error);
    }
  };

  return (
    <div className="w-full max-w-3xl border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6 space-y-4">
        {/* Header: User Info + Posted Date */}
        {user && (
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <img
                src={user.profilePicture || "/default-avatar.png"}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
            <span className="text-sm text-gray-500 whitespace-nowrap">
              {getDaysAgo(gig.createdAt)}
            </span>
          </div>
        )}

        {/* Gig Content */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">{gig.title}</h2>
          
          {/* Description */}
          <div className="text-gray-700">
            {gig.description.length > 150 ? (
              <>
                {gig.description.slice(0, 150)}...
                <Link
                  href={`/gig/${gig.id}`}
                  className="text-blue-600 hover:text-blue-800 font-medium ml-1"
                >
                  read more
                </Link>
              </>
            ) : (
              <>{gig.description}</>
            )}
          </div>

          {/* Skills */}
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Required Skills</h4>
            <div className="flex flex-wrap gap-2">
              {gig.skillsRequired.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Price and Deadline */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="space-y-1">
              <p className="text-gray-600 text-sm">Price</p>
              <p className="text-xl font-bold text-gray-900">₹{gig.price}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-gray-600 text-sm">Deadline</p>
              <p className="text-red-600 font-semibold">
                {formatDeadline(gig.deadline)}
              </p>
            </div>
          </div>
        </div>

        {/* Apply Button */}
        {gig.clientId !== id && (
          <div className="pt-4 flex justify-end">
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className={`w-32 rounded-lg ${
                    applied
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-black hover:bg-gray-800"
                  } text-white text-base transition-colors duration-200`}
                  disabled={applied}
                >
                  <span className="group inline-flex items-center">
                    {applied ? (
                      <>
                        Applied
                        <Check className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        Apply
                        <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                      </>
                    )}
                  </span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Application</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to apply for this gig? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setShowDialog(false)}
                    className="rounded-lg"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyConfirm}
                    className="bg-black hover:bg-gray-800 text-white rounded-lg"
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
      </div>
    </div>
  );
};

// Loading Skeleton Component
const GigSkeleton = () => (
  <div className="w-full max-w-3xl border rounded-lg bg-white shadow-sm p-6 space-y-4 animate-pulse">
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full" />
        <div className="space-y-2">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-3 w-24 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded" />
    </div>
    <div className="space-y-4">
      <div className="h-6 w-3/4 bg-gray-200 rounded" />
      <div className="space-y-2">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />
        ))}
      </div>
    </div>
  </div>
);

// Page Component
const Page = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      const [gigsData, usersData] = await Promise.all([
        fetchGigs(),
        fetchUsers(),
      ]);

      // Sort gigs by createdAt timestamp (latest first)
      const sortedGigs = [...gigsData].sort((a, b) => 
        b.createdAt.toMillis() - a.createdAt.toMillis()
      );

      setGigs(sortedGigs);
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const gigsRef = collection(firestore, "gigs");
    const unsubscribe = onSnapshot(gigsRef, () => {
      fetchData();
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Available Gigs</h1>
        <div className="space-y-6">
          {loading ? (
            // Show 3 loading skeletons
            Array(3)
              .fill(0)
              .map((_, i) => <GigSkeleton key={i} />)
          ) : gigs.length > 0 ? (
            gigs.map((gig) => (
              <GigCard
                key={gig.id}
                gig={gig}
                user={users.find((user) => user.uid === gig.clientId)}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No gigs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
