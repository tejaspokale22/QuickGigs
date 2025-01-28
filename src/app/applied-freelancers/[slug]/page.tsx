"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGigById } from "@/app/utils/actions/gigActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from "next/image";
import { Eye, CheckCircle, Mail } from "lucide-react";
import { findBestFreelancer } from "@/app/utils/ai/findBestFreelancer";
import Gemini from "../../../../public/gemini.svg";
import Link from "next/link";

export default function AppliedFreelancersPage() {
  const { slug } = useParams() as { slug: string };
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bestFreelancer, setBestFreelancer] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  console.log(bestFreelancer);
  

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

  const handleFindBestFreelancer = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      setBestFreelancer(null);

      const gig = await fetchGigById(slug);
      if (!gig) throw new Error("Gig not found");

      // Extract necessary details for the AI function
      const gigDetails = {
        title: gig.title,
        description: gig.description,
        requiredSkills: gig.skillsRequired,
      };

      const freelancersData = freelancers.map((freelancer) => ({
        name: freelancer.name,
        skills: freelancer.skills,
        experience: freelancer.experience,
        rating: 1000,
        bio: freelancer.bio,
        profilePicture:freelancer.profilePicture,
      }));
      const result = await findBestFreelancer(gigDetails, freelancersData);
      setBestFreelancer(result);
    } catch (err) {
      console.error(err);
      setAiError("Failed to find the best freelancer. Please try again later.");
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <p className="text-center">Loading freelancers...</p>;
  if (error) return <p className="text-red-500 text-center">Error: {error}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Applied Freelancers</h1>
      {/* AI Button */}
      <div className="flex justify-start mb-6 items-center bg-gray-200 p-4 rounded">
        <span className="text-lg font-normal mr-1">Find best Freelancer for the Gig: </span>
          <button
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 flex items-center justify-center gap-1"
          onClick={handleFindBestFreelancer}
          disabled={aiLoading}
        >
              <Image src={Gemini} alt="Gemini Icon" className="inline " width={20} height={20} /> 
              {aiLoading ?'Analyzing...' :'Using AI'}
        </button>
      </div>


      {/* AI Result */}
      {bestFreelancer && (
        <div className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-100">
          <div className="flex items-center space-x-1">
            {bestFreelancer.name && <p className="font-bold">Best Freelancer:</p>}
            {bestFreelancer.profilePicture && <Image
              src={bestFreelancer.profilePicture}
              alt={bestFreelancer.name}
              className="rounded-full"
              width={26}
              height={22}
            />
}
              <p className="text-lg font-medium">{bestFreelancer.name}</p>
          </div>
            <div>
              <span className="font-bold">Reason:</span><p className="text-gray-600">{bestFreelancer.reason}</p>
            </div>
        </div>
      )}

      {aiError && <p className="text-red-500 text-center">{aiError}</p>}

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
                        src={freelancer.profilePicture || null}
                        alt={`${freelancer.name}'s profile`}
                        className="rounded-full"
                        width={40}
                        height={30}
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
                    <Link href={`/view-profile/${freelancer.uid}`} passHref>
                      <button
                        className="border border-gray-400 bg-white text-black w-32 p-2 text-sm rounded hover:bg-gray-300 hover:text-black"
                      >
                        <Eye className="inline mr-1" /> View Profile
                      </button>
                    </Link>
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
