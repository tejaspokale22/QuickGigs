"use client";

import React, { useEffect, useState } from "react";
import { fetchGigs } from "../utils/actions/gigActions";
import { fetchUsers } from "../utils/actions/authActions";
import { Check, ChevronRightIcon, Search, Briefcase, Filter, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Gig, User } from "../utils/types";
import { formatDeadline, getDaysAgo } from "../utils/utilityFunctions";
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
import { onSnapshot, collection } from "firebase/firestore";

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
    <div className="w-full max-w-4xl border rounded bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6 space-y-4">
        {/* Header: User Info + Posted Date */}
        {user && (
          <div className="flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <div className="relative w-12 h-12">
                <Image
                  src={user.profilePicture || "/default-avatar.png"}
                  alt={user.name}
                  fill
                  className="rounded-full object-cover border-2 border-gray-100"
                  priority
                />
              </div>
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
              <>{gig.description.slice(0, 150)}...</>
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
              <p className="text-gray-600 text-sm">Payout</p>
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

        {/* Action Buttons */}
        <div className="pt-4 flex justify-end gap-3">
          <Link href={`/gig/${gig.id}`}>
            <Button
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded"
            >
              View Details
            </Button>
          </Link>
          {gig.clientId !== id && (
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className={`w-32 rounded ${
                    applied
                      ? "bg-gray-600 hover:bg-gray-700"
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
                    className="rounded hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleApplyConfirm}
                    className="bg-black hover:bg-gray-800 text-white rounded"
                  >
                    Confirm
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const GigSkeleton = () => (
  <div className="w-full max-w-4xl border rounded-lg bg-white shadow-sm p-6 space-y-4 animate-pulse">
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

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

  // Get all unique skills from gigs
  const allSkills = Array.from(
    new Set(gigs.flatMap(gig => gig.skillsRequired))
  ).sort();

  // Filter gigs based on search, skills, and price
  const filteredGigs = gigs.filter(gig => {
    const matchesSearch = gig.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      gig.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 || 
      selectedSkills.some(skill => gig.skillsRequired.includes(skill));
    const matchesPrice = gig.price >= priceRange[0] && gig.price <= priceRange[1];
    return matchesSearch && matchesSkills && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Compact Header with Search */}
      <div className="bg-black py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="max-w-2xl space-y-4">
              <div>
                <h1 className="text-3xl font-bold text-white">Explore Freelance Opportunities</h1>
                <p className="text-gray-300 mt-2">Discover opportunities that match your skills and expertise</p>
              </div>
              <div className="flex items-center gap-4 text-gray-300 text-sm">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  <span>{gigs.length} Active Gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Updated live</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="w-4 h-4" />
                  <span>Secure Payments</span>
                </div>
              </div>
            </div>
            
            {/* Search Section */}
            <div className="flex-shrink-0 w-full md:w-auto space-y-4">
              <div className="relative">
                <Search className="text-white/70 absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 z-10" />
                <input
                  type="text"
                  placeholder="Search by skills, title, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full md:w-[350px] pl-10 pr-4 py-3 rounded-lg bg-white/10 
                    border border-white/20 text-white placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-white/30
                    focus:border-transparent backdrop-blur-sm"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                {['All Gigs', 'Web Dev', 'Mobile', 'UI/UX', 'Writing'].map((filter) => (
                  <button
                    key={filter}
                    className="px-4 py-1.5 rounded-full text-sm font-medium
                      bg-white/10 text-white border border-white/20 
                      hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded border border-gray-200 
              shadow-sm divide-y divide-gray-100">
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>

                {/* Skills Filter */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Skills</h3>
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {allSkills.map(skill => (
                      <label key={skill} 
                        className="flex items-center gap-2 p-2 rounded
                          hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={() => {
                            setSelectedSkills(prev =>
                              prev.includes(skill)
                                ? prev.filter(s => s !== skill)
                                : [...prev, skill]
                            )
                          }}
                          className="rounded border-gray-300 text-black focus:ring-black"
                        />
                        <span className="text-sm text-gray-600">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-4">Budget Range</h3>
                <input
                  type="range"
                  min="0"
                  max="100000"
                  step="1000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full accent-black"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>₹0</span>
                  <span>₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{filteredGigs.length}</span> opportunities found
              </p>
              <select 
                className="text-sm border rounded-lg px-3 py-1.5 bg-white
                  text-gray-700 focus:outline-none focus:ring-2 focus:ring-black"
                title="Sort options"
              >
                <option>Latest First</option>
                <option>Price: High to Low</option>
                <option>Price: Low to High</option>
              </select>
            </div>

            {/* Gigs Grid */}
            {loading ? (
              <div className="space-y-4">
                {Array(3).fill(0).map((_, i) => (
                  <GigSkeleton key={i} />
                ))}
              </div>
            ) : filteredGigs.length > 0 ? (
              <div className="space-y-4">
                {filteredGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    user={users.find((user) => user.uid === gig.clientId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No opportunities found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your search criteria or filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
