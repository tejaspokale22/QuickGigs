"use client";

import { useEffect, useState } from "react";
import { Gig, User } from "@/app/utils/types";
import { useParams } from "next/navigation";
import { formatDeadline } from "@/app/utils/utilityFunctions";
import { firestore } from "@/app/utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchUser } from "@/app/utils/actions/authActions";
import { Copy, Mail, Check, X } from "lucide-react"; // Importing the X icon
import { copyToClipboard } from "@/app/utils/utilityFunctions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { acceptGig } from "@/app/utils/actions/gigActions";
import { rejectGig } from "@/app/utils/actions/gigActions";
import { Button } from "@/components/ui/button";
import { markAsCompleted } from "@/app/utils/actions/gigActions";
import { approvePayment } from "@/app/utils/actions/paymentActions";
import Image from "next/image";

const AssignedGigsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<{ [key: string]: User }>({});
  const [clipboardStatus, setClipboardStatus] = useState<{ [key: string]: boolean }>({});
  const [selectedGig,setSelectedGig] = useState<string | null>(null);  

  // Clipboard functionality
  const handleClipboard = (email: string, gigId: string) => {
    copyToClipboard(email);
    setClipboardStatus((prev) => ({ ...prev, [gigId]: true }));

    setTimeout(() => {
      setClipboardStatus((prev) => ({ ...prev, [gigId]: false }));
    }, 3000);
  };

  // Accept gig
  const handleAccept = async () => {
    if(!selectedGig) return;
    try {
      const response=await acceptGig(selectedGig);
      if(response){
        // alert("rejected");
      }
    } catch (error) {
      console.error("Error accepting gig:", error);
    }
  };
  
  //Reject Gig
  const handleReject = async () => {
    if(!selectedGig) return;
    try {
      const response=await rejectGig(selectedGig);
      if(response){
        // alert("rejected");
      }
    } catch (error) {
      console.error("Error rejecting gig:", error);
    }
  };

  //Mark as Completed
  const handleCompleted = async () => {
    if(!selectedGig) return;
    try {
      const response=await markAsCompleted(selectedGig);
      if(response){
        // alert("rejected");
      }
    } catch (error) {
      console.error("Error marking as completed!", error);
    }
  };

  //Approve Payment
  const handleApprovePayment = async () => {
    if(!selectedGig) return;
    try {
      const response=await approvePayment(selectedGig);
      if(response){
        // alert("rejected");
      }
    } catch (error) {
      console.error("Error approving Payment!", error);
    }
  };

  useEffect(() => {
    if (!slug) return;

    const gigsRef = collection(firestore, "gigs");
    const q = query(gigsRef, where("freelancerId", "==", slug));

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
  }, [slug]);

  if (loading)
    return <p className="text-center text-lg text-gray-600 mt-10">Loading assigned gigs...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;
  if (gigs.length === 0)
    return <p className="text-center text-lg text-gray-500 mt-10">No assigned gigs found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="px-2 py-5 bg-gray-50">
            <h2 className="text-2xl font-bold text-gray-900">
              Assigned Gigs
            </h2>
          </div>
        <div className="bg-white rounded overflow-hidden">
          <div className="divide-y divide-gray-200">
            {gigs.map((gig) => (
              !(gig.status==="completed") &&
              <div key={gig.id} className="p-6 transition-colors duration-200">
                {clients[gig.clientId] && (
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={clients[gig.clientId].profilePicture || "/default-avatar.png"}
                        alt={clients[gig.clientId].name}
                        width={48}
                        height={48}
                        className="rounded-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-semibold text-gray-900">{clients[gig.clientId].name}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="mr-2">{clients[gig.clientId].email}</span>
                        <button
                          onClick={() => handleClipboard(clients[gig.clientId].email, gig.id)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          aria-label="Copy Email"
                        >
                          {clipboardStatus[gig.id] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{gig.title}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="font-medium">Deadline:</span>
                      <span className="ml-2">{formatDeadline(gig.deadline)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        gig.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : gig.status === "progress"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                    </span>

                    {/* Accept and Reject Buttons */}
                    {gig.status === "pending" && (
                      <div className="flex gap-3">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedGig(gig.id)}
                              className="rounded flex items-center gap-2 border-2 border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                            >
                              <Check className="w-4 h-4" /> Accept
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white text-black">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Acceptance</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to accept this gig request?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-black hover:bg-gray-800 text-white rounded"
                                onClick={handleAccept}
                              >
                                Yes, Accept
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              onClick={() => setSelectedGig(gig.id)}
                              className="rounded flex items-center gap-2 border-2 border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
                            >
                              <X className="w-4 h-4" /> Reject
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white text-black">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirm Rejection</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to reject this gig request?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-black hover:bg-gray-800 text-white rounded"
                                onClick={handleReject}
                              >
                                Yes, Reject
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        Disclaimer: Mark as completed only when you have finished the gig work and sent it for approval to the client.
                      </p>
                      
                      <div className="flex gap-3">
                        {gig.status === "progress" && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedGig(gig.id)}
                                className="bg-black hover:bg-gray-800 text-white rounded"
                              >
                                Mark as Completed
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you have finished with the gig work?
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-black hover:bg-gray-800 text-white rounded"
                                  onClick={handleCompleted}
                                >
                                  Yes, Completed
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}

                        {gig.paymentStatus === true && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                onClick={() => setSelectedGig(gig.id)}
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Approve Payout
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-white text-black">
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Payment Approval</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Only approve if you have received the payment from the client!
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900">
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                  onClick={handleApprovePayment}
                                >
                                  Yes, Approve
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignedGigsPage;

