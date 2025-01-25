"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { fetchGigs } from "../utils/actions/gigActions";

const Page = () => {
  const [gigs, setGigs] = useState<any[]>([]); // State to store gigs
  const [loading, setLoading] = useState<boolean>(false); // State for loading

  useEffect(() => {
    const getGigs = async () => {
      setLoading(true);
      try {
        const gigsData = await fetchGigs();
        setGigs(gigsData); // Store gigs in state
      } catch (error) {
        console.error("Error fetching gigs:", error);
      } finally {
        setLoading(false);
      }
    };

    getGigs(); // Fetch gigs on component mount
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Available Gigs
      </h1>

      {loading ? (
        <p>Loading gigs...</p>
      ) : (
        <div className="space-y-6">
          {/* Loop through gigs to display them */}
          {gigs.map((gig) => (
            <div
              key={gig.id}
              className="border p-4 rounded-lg shadow-lg bg-white flex flex-col items-center"
            >
              <h2 className="text-xl font-medium text-gray-800 mb-2">
                {gig.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4">{gig.description}</p>
              <p className="text-lg font-semibold text-gray-800 mb-4">
                ₹{(gig.amount * 82).toLocaleString()} {/* Price in INR */}
              </p>
              <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Apply
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;
