"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchGigById } from "@/app/utils/actions/gigActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import Image from "next/image";
import { Eye, Mail, Copy, ArrowLeft } from "lucide-react";
import { findBestFreelancer } from "@/app/utils/ai/findBestFreelancer";
import Gemini from "../../../../public/gemini.svg";
import Link from "next/link";
import { copyToClipboard } from "@/app/utils/utilityFunctions";
import { Check } from "lucide-react";
import { firestore } from "@/app/utils/firebase";
import { onSnapshot, doc} from "firebase/firestore";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { updateGigFreelancer } from "@/app/utils/actions/gigActions";
import { useRouter } from "next/navigation";


export default function AppliedFreelancersPage() {

  const { slug } = useParams() as { slug: string };
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [bestFreelancer, setBestFreelancer] = useState<any | null>(null);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [clipboardStatus, setClipboardStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedFreelancer, setSelectedFreelancer] = useState<string | null>(null);
  const router=useRouter();

  const handleClipboard = (text: string, freelancerId: string) => {
    setClipboardStatus((prev) => ({ ...prev, [freelancerId]: true }));
    copyToClipboard(text);
  
    setTimeout(() => {
      setClipboardStatus((prev) => ({ ...prev, [freelancerId]: false }));
    }, 3000);
  };

  const handleAssignGig = async () => {
    if (!selectedFreelancer || !slug) return;
  
    try {
      const response=await updateGigFreelancer(slug, selectedFreelancer);
      if(response){
        router.push("/posted-gigs")
      }
    } catch (error) {
      console.error("Error assigning freelancer:", error);
    }
  };
  

  useEffect(() => {
    const fetchFreelancers = async () => {
      setLoading(true);
      setError(null);

      try {

        if (!slug) return;

  // Reference to the specific gig document
  const gigRef = doc(firestore, "gigs", slug);

  // Set up real-time listener for changes in the gig document
  const unsubscribe = onSnapshot(gigRef, async (snapshot) => {
    if (!snapshot.exists()) {
      setError("Gig not found");
      return;
    }

    const gigData = snapshot.data();
    const { appliedFreelancers = [] } = gigData;

    // Fetch details of newly applied freelancers
    const freelancerDetails = await Promise.all(
      appliedFreelancers.map((userId: string) => fetchUser(userId))
    );

    setFreelancers(freelancerDetails);
    setLoading(false);
  });
  // Cleanup function to unsubscribe when component unmounts
  return () => unsubscribe();
      } catch (err) {
        console.error(err);
        setError("Failed to fetch freelancers. Please try again later.");
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
        profilePicture: freelancer.profilePicture,
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-500 text-center font-medium">Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/posted-gigs" 
                className="flex items-center text-gray-600 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-1" />
                <span>Back to Gigs</span>
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">Applied Freelancers</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {freelancers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-600 text-lg">No freelancers have applied for this gig yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Analysis Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-gray-900">AI-Powered Analysis</h2>
                  <button
                    className="inline-flex items-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                    onClick={handleFindBestFreelancer}
                    disabled={aiLoading}
                  >
                    <Image src={Gemini} alt="Gemini Icon" className="mr-2" width={20} height={20} />
                    {aiLoading ? 'Analyzing...' : 'Find Best Match'}
                  </button>
                </div>
              </div>

              {bestFreelancer && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image
                      src={bestFreelancer.profilePicture}
                      alt={bestFreelancer.name}
                      className="rounded-full"
                      width={40}
                      height={40}
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">Best Match: {bestFreelancer.name}</h3>
                    </div>
                  </div>
                  <p className="text-gray-600 mt-2">{bestFreelancer.reason}</p>
                </div>
              )}

              {aiError && (
                <div className="mt-4 p-4 bg-red-50 rounded-lg">
                  <p className="text-red-600">{aiError}</p>
                </div>
              )}
            </div>

            {/* Freelancers Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Freelancer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Profile
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {freelancers.map((freelancer) => (
                      <tr key={`${freelancer.id}-${freelancer.name}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3">
                            <Image
                              src={freelancer.profilePicture || ''}
                              alt={`${freelancer.name}'s profile`}
                              className="rounded-full"
                              width={40}
                              height={40}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{freelancer.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{freelancer.email}</span>
                            <button
                              onClick={() => handleClipboard(freelancer.email, freelancer.uid)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {clipboardStatus[freelancer.id] ? (
                                <Check className="w-4 h-4 text-green-500" />
                              ) : (
                                <Copy className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                          <Link href={`/view-profile/${freelancer.uid}`}>
                            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                              <Eye className="w-4 h-4 mr-2" />
                              View Profile
                            </button>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button 
                                className="inline-flex items-center px-4 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
                                onClick={() => setSelectedFreelancer(freelancer.uid)}
                              >
                                Assign Gig
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl font-semibold">Confirm Assignment</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-600">
                                  Are you sure you want to assign this gig to {freelancer.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-md transition-colors">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                  className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                                  onClick={handleAssignGig}
                                >
                                  Confirm Assignment
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  function handleApproveFreelancer(freelancerId: string) {
    alert(`Freelancer with ID: ${freelancerId} has been approved.`);
    // Add API logic here to update the freelancer's status
  }
}
