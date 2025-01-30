"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { fetchGigsByClientId } from "@/app/utils/actions/gigActions";
import { Gig } from "../utils/types";
import { formatDeadline } from "../utils/utilityFunctions";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { firestore } from "@/app/utils/firebase";

export default function PostedGigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const clientId = localStorage.getItem("uid");
    if (!clientId) {
      setError("User ID not found. Please log in.");
      setLoading(false);
      return;
    }

    setLoading(true);

    // Reference the gigs collection with a query filtering by clientId
    const gigsQuery = query(
      collection(firestore, "gigs"),
      where("clientId", "==", clientId) // Fetch only the gigs posted by the client
    );

    // Real-time listener
    const unsubscribe = onSnapshot(
      gigsQuery,
      (snapshot) => {
        const gigsData: Gig[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Gig[];
        setGigs(gigsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching gigs:", error);
        setError("Failed to fetch posted gigs. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup listener on unmount
  }, []);

  if (loading) return <p className="text-center">Loading posted gigs...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Posted Gigs</h1>
      {gigs.length === 0 ? (
        <p className="text-center">No gigs found.</p>
      ) : (
        <ul className="space-y-4">
          {gigs.map((gig) => (
            <li
              key={gig.id}
              className="bg-white shadow rounded-lg p-4 flex justify-between items-center border border-gray-400"
            >
              <div>
                <h2 className="text-lg font-semibold">{gig.title}</h2>
                <p>
                  <strong>Deadline:</strong> {formatDeadline(gig.deadline)}
                </p>
              </div>
              {!gig.freelancerId ? (
                <Link href={`/applied-freelancers/${gig.id}`}>
                  <Button className="text-white w-40 p-1 text-sm bg-black hover:bg-gray-800 rounded">
                    <Eye /> View Freelancers
                  </Button>
                </Link>
              ) : (
                <div>Waiting for Freelancer</div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
