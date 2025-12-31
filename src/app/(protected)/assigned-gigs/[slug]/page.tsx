"use client";

import { useEffect, useState } from "react";
import { Gig, User } from "@/app/utils/types";
import { useParams } from "next/navigation";
import { formatDeadline } from "@/app/utils/utilityFunctions";
import { firestore } from "@/app/utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchUser } from "@/app/utils/actions/authActions";
import { Copy, Mail, Check, X, CheckCircle } from "lucide-react"; // Importing the X icon
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
    <div className="min-h-screen bg-gray-50 pt-20 p-6">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Assigned Gigs</h2>
          <p className="text-gray-600">Manage your current work assignments</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : gigs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <p className="text-gray-500 text-lg">No assigned gigs found.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {gigs.map((gig) => (
              !(gig.status === "completed") && (
                <div key={gig.id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
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
                            <button
                              onClick={() => handleClipboard(clients[gig.clientId].email, gig.id)}
                              className="text-gray-500 hover:text-gray-700 transition-colors ml-1"
                              aria-label="Copy Email"
                            >
                              {clipboardStatus[gig.id] ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                            </button>
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
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          gig.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : gig.status === "progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex justify-between items-end pt-2">
                        <div>
                          <p className="text-xs text-gray-600 bg-gray-50 p-2 rounded-lg border border-gray-200">
                            Disclaimer: Mark as completed only when you have finished the gig work and sent it for approval to the client.
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {gig.status === "pending" && (
                            <>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={() => setSelectedGig(gig.id)}
                                    className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded flex items-center gap-1 text-sm"
                                  >
                                    <Check className="w-3 h-3" /> Accept
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white rounded-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold">Confirm Acceptance</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
                                      Are you sure you want to accept this gig request?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded text-sm">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded text-sm"
                                      onClick={handleAccept}
                                    >
                                      Confirm Acceptance
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    onClick={() => setSelectedGig(gig.id)}
                                    className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded flex items-center gap-1 text-sm border border-red-200"
                                  >
                                    <X className="w-3 h-3" /> Reject
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-white rounded-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-bold">Confirm Rejection</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
                                      Are you sure you want to reject this gig request?
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-4">
                                    <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded text-sm">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded text-sm"
                                      onClick={handleReject}
                                    >
                                      Confirm Rejection
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          )}

                          {gig.status === "progress" && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  onClick={() => setSelectedGig(gig.id)}
                                  className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded flex items-center gap-1 text-sm"
                                >
                                  <CheckCircle className="w-3 h-3" /> Mark as Completed
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white rounded-xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold">Confirm Completion</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
                                    Are you sure you have finished with the gig work?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4">
                                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded text-sm">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-black hover:bg-gray-800 text-white px-4 py-1.5 rounded text-sm"
                                    onClick={handleCompleted}
                                  >
                                    Confirm Completion
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
                                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded flex items-center gap-1 text-sm"
                                >
                                  <CheckCircle className="w-3 h-3" /> Approve Payout
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white rounded-xl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-xl font-bold">Confirm Payment Approval</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 mt-2 text-sm">
                                    Only approve if you have received the payment from the client!
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="mt-4">
                                  <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 text-gray-900 px-4 py-1.5 rounded text-sm">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded text-sm"
                                    onClick={handleApprovePayment}
                                  >
                                    Confirm Approval
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
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedGigsPage;

