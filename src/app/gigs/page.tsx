"use client";

import React, { useEffect, useState } from "react";
import { fetchGigs } from "../utils/actions/gigActions";
import { fetchUsers } from "../utils/actions/authActions";
import { Check, ChevronRightIcon, Search, Briefcase, Filter, Clock, DollarSign } from "lucide-react";
import Link from "next/link";
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
    <div className="w-full max-w-4xl border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
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

        {/* Apply Button */}
        {gig.clientId !== id && (
          <div className="pt-4 flex justify-end">
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
              <AlertDialogTrigger asChild>
                <Button
                  className={`w-32 rounded ${
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
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Discover Your Next
              <br />
              Professional Opportunity
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed">
              Connect with industry-leading clients and work on innovative projects.
              Find opportunities that match your expertise and career goals.
            </p>
          </div>
            
          {/* Search Bar */}
          <div className="relative max-w-2xl mb-12">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by skills, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/10 
                border border-white/20 text-white placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-white/30
                text-base backdrop-blur-sm"
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl">
            {[
              { icon: Briefcase, value: `${gigs.length}+`, label: 'Active Opportunities' },
              { icon: Clock, value: '24/7', label: 'Quick Response Time' },
              { icon: DollarSign, value: 'Secure', label: 'Payment Protection' }
            ].map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex items-center gap-4">
                  <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-gray-300 text-sm">{stat.label}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Tags */}
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Browse Popular Categories</h2>
          <div className="flex flex-wrap gap-3">
            {['Web Development', 'Mobile Apps', 'UI/UX Design', 'Content Writing', 
              'Digital Marketing', 'Data Science'].map((category) => (
              <button
                key={category}
                className="px-5 py-2.5 bg-gray-50 rounded-full
                  text-sm font-medium text-gray-700 hover:bg-gray-100 
                  transition-all duration-200 border border-gray-200
                  hover:border-gray-300 hover:shadow-sm"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-10">
          {/* Filters Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-2xl border border-gray-200 
              shadow-sm divide-y divide-gray-100">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filters
                </h2>

                {/* Skills Filter */}
                <div className="space-y-4">
                  <h3 className="font-medium text-gray-900">Skills</h3>
                  <div className="max-h-48 overflow-y-auto pr-2 space-y-1">
                    {allSkills.map(skill => (
                      <label key={skill} 
                        className="flex items-center gap-2 p-2 rounded-lg
                          hover:bg-gray-50 cursor-pointer transition-colors duration-150"
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
                          className="rounded border-gray-300 text-black focus:ring-gray-400"
                        />
                        <span className="text-sm text-gray-600">{skill}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="p-6">
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

              {/* Support Section */}
              <div className="p-6 bg-gray-50 rounded-b-2xl">
                <p className="text-sm text-gray-600">
                  Need help finding the right opportunity? 
                  <Link href="/help" className="text-blue-600 hover:text-blue-700 font-medium ml-1">
                    Contact Support
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
              <p className="text-gray-600">
                <span className="font-medium text-gray-900">{filteredGigs.length}</span> opportunities found
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  className="text-sm border rounded-lg px-4 py-2 bg-white
                    text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
                  title="Sort options"
                >
                  <option>Latest First</option>
                  <option>Price: High to Low</option>
                  <option>Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Gigs Grid */}
            {loading ? (
              <div className="space-y-6">
                {Array(3).fill(0).map((_, i) => (
                  <GigSkeleton key={i} />
                ))}
              </div>
            ) : filteredGigs.length > 0 ? (
              <div className="space-y-6">
                {filteredGigs.map((gig) => (
                  <GigCard
                    key={gig.id}
                    gig={gig}
                    user={users.find((user) => user.uid === gig.clientId)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-200">
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
