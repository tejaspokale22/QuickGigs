"use client"

import { useEffect, useState } from "react";
import { Gig, User } from "@/app/utils/types";
import { formatDeadline } from "@/app/utils/utilityFunctions";
import { firestore } from "@/app/utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchUser } from "@/app/utils/actions/authActions";
import { Mail } from "lucide-react";
import Image from "next/image";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";

const AppliedGigsPage = () => {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<{ [key: string]: User }>({});
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("uid");
        if (!userId) {
          setError("User not authenticated");
          setLoading(false);
          return;
        }

        const gigsRef = collection(firestore, "gigs");
        const q = query(gigsRef, where("appliedFreelancers", "array-contains", userId));

        const unsubscribe = onSnapshot(
          q,
          async (snapshot) => {
            const gigsData: Gig[] = snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            })) as Gig[];
            setGigs(gigsData);
            setLoading(false);

            // Fetch client details for each gig
            const clientDetails: { [key: string]: User } = {};
            await Promise.all(
              gigsData.map(async (gig) => {
                if (gig.clientId && !clientDetails[gig.clientId]) {
                  try {
                    const clientData = await fetchUser(gig.clientId);
                    clientDetails[gig.clientId] = clientData;
                  } catch (err) {
                    console.error("Error fetching client details:", err);
                  }
                }
              })
            );
            setClients(clientDetails);
          },
          (error) => {
            console.error("Error fetching gigs:", error);
            setError("Failed to load gigs.");
            setLoading(false);
          }
        );

        return () => unsubscribe();
      } catch (err) {
        console.error("Error in fetchData:", err);
        setError("An error occurred while fetching data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Applied Gigs</h2>
            <p className="text-gray-600">Track your applications and their status</p>
          </div>
          <div className="h-64">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Applied Gigs</h2>
            <p className="text-gray-600">Track your applications and their status</p>
          </div>
          <div className="h-64">
            <Spinner />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Applied Gigs</h2>
            <p className="text-gray-600">Track your applications and their status</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-center text-red-500 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (gigs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 p-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Applied Gigs</h2>
            <p className="text-gray-600">Track your applications and their status</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-8">
            <p className="text-center text-gray-500 text-lg">No applied gigs found.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Applied Gigs</h2>
          <p className="text-gray-600">Track your applications and their status</p>
        </div>

        <div className="grid gap-6">
          {gigs.map((gig) => (
            <Link 
              key={gig.id} 
              href={`/assigned-gigs/${gig.id}`}
              className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              <div className="p-4">
                {clients[gig.clientId] && (
                  <div className="flex items-center gap-3 mb-3 pb-3 border-b border-gray-100">
                    <div>
                      <Image
                        src={clients[gig.clientId].profilePicture || "/default-avatar.png"}
                        alt={clients[gig.clientId].name}
                        width={40}
                        height={40}
                        className="rounded-full border-2 border-gray-100 object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-gray-900">{clients[gig.clientId].name}</p>
                      <p className="text-gray-600 flex items-center gap-1 text-xs">
                        <Mail className="w-3 h-3" />
                        {clients[gig.clientId].email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{gig.title}</h3>
                    <div className="flex items-center gap-1 text-gray-600 text-xs">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>Deadline: {formatDeadline(gig.deadline)}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pb-3 border-b border-gray-100">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {gig.status || "Applied"}
                    </span>
                  </div>

                  <div className="flex justify-between items-end pt-2">
                    <div>
                      <div className="bg-gray-100 px-3 py-1.5 rounded-lg text-gray-700 text-xs">
                        Waiting for client's response
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-600 text-sm">
                        Payout: ₹{gig.price}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppliedGigsPage;
