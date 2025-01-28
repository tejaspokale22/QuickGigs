"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGigById } from "@/app/utils/actions/gigActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from "next/image";
import { Eye, CheckCircle, Mail } from 'lucide-react';

export default function AppliedFreelancersPage() {
  const { slug } = useParams() as { slug: string };
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        setLoading(true);
        setError(null);

        const gig = await fetchGigById(slug);
        if (!gig) throw new Error("Gig not found");

        const { appliedFreelancers = [] } = gig;

        const freelancerDetails = await Promise.all(
          appliedFreelancers.map((userId: string) => fetchUser(userId))
        );

        setFreelancers(freelancerDetails);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch freelancers. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [slug]);

  if (loading) return <p className="text-center">Loading freelancers...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Applied Freelancers</h1>
      {freelancers.length === 0 ? (
        <p className="text-center">No freelancers have applied for this gig.</p>
      ) : (
        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full table-auto divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase border-b border-r border-gray-300">
                  Freelancer
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase border-b border-r border-gray-300">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase border-b border-r border-gray-300">
                  View Profile
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600 uppercase border-b border-gray-300">
                  Assign Gig
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {freelancers.map((freelancer) => (
                <tr key={`${freelancer.id}-${freelancer.name}`} className="border-b border-gray-300">
                  <td className="px-4 py-2 whitespace-nowrap border-b border-r border-gray-300">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={freelancer.profilePicture}
                        alt={`${freelancer.name}'s profile`}
                        className="w-12 h-12 rounded-full"
                        width={40}
                        height={40}
                      />
                      <span className="text-base font-base">{freelancer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-1 whitespace-nowrap border-b border-r border-gray-300">
                    <span className="text-sm font-base">
                      <Mail className="inline" width={20} /> {freelancer.email}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-r border-gray-300">
                    <button
                      className="border border-gray-400 bg-white text-black w-32 p-2 text-sm rounded hover:bg-gray-300 hover:text-black"
                      onClick={() => window.open(`/profile/${freelancer.id}`, "_blank")}
                    >
                      <Eye className="inline mr-1" /> View Profile
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap border-b border-r border-gray-300">
                    <button
                      className="bg-black text-white w-32 p-2 text-sm rounded hover:bg-gray-800"
                      onClick={() => handleApproveFreelancer(freelancer.id)}
                    >
                      Approve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  function handleApproveFreelancer(freelancerId: string) {
    alert(`Freelancer with ID: ${freelancerId} has been approved.`);
    // Add API logic here to update the freelancer's status
  }
}
