"use client";

import { useEffect, useState } from "react";
import { Gig, User } from "@/app/utils/types";
import { useParams } from "next/navigation";
import { formatDeadline } from "@/app/utils/utilityFunctions";
import { firestore } from "@/app/utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchUser } from "@/app/utils/actions/authActions";
import { Copy, Mail, Check, X, BookMarked, Bookmark } from "lucide-react"; // Importing the X icon
import { copyToClipboard } from "@/app/utils/utilityFunctions";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { acceptGig } from "@/app/utils/actions/gigActions";
import { rejectGig } from "@/app/utils/actions/gigActions";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Assigned Gigs
      </h2>
      <ul className="space-y-6">
        {gigs.map((gig) => (
          <li key={gig.id} className="bg-white p-6 rounded border border-gray-300">
            {clients[gig.clientId] && (
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={clients[gig.clientId].profilePicture || "/default-avatar.png"}
                  alt={clients[gig.clientId].name}
                  className="w-10 h-10 rounded-full border border-gray-300"
                />
                <div>
                  <p className="text-lg font-medium text-gray-800">{clients[gig.clientId].name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail width={18} className="mr-1" />
                    {clients[gig.clientId].email}
                    <button
                      onClick={() => handleClipboard(clients[gig.clientId].email, gig.id)}
                      className="text-gray-600 hover:text-gray-900 ml-1"
                      aria-label="Copy Email"
                    >
                      {clipboardStatus[gig.id] ? <Check width={16} /> : <Copy width={16} />}
                    </button>
                  </p>
                </div>
              </div>
            )}
            <h3 className="text-xl font-semibold text-gray-800">{gig.title}</h3>
            <p className="text-gray-600 mt-2">Deadline: {formatDeadline(gig.deadline)}</p>
            <p
              className={`mt-3 font-medium text-sm px-3 py-1 inline-block rounded ${
                gig.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : gig.status === "progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Status: {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
            </p>

            {/* Accept and Reject Buttons */}
            {gig.status === "pending" && (
              <div className="flex gap-4 mt-4 justify-end">

                {/* Accept Gig Alert  */}
                <AlertDialog>
  <AlertDialogTrigger asChild>
  <button
                  onClick={() => setSelectedGig(gig.id)}
                  className="flex items-center text-green-600 border border-green-500 p-1 rounded hover:bg-green-100"
                >
                  <Check className="mr-1" /> Accept
                </button>
  </AlertDialogTrigger>
  <AlertDialogContent className="bg-white text-black">
    <AlertDialogHeader>
      <AlertDialogTitle>Please Confirm!</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to accept this gig request?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="bg-white text-black rounded">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        className="bg-black text-white rounded hover:bg-gray-800"
        onClick={handleAccept}
      >
        Yes, Accept
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>


                {/* Reject Gig Alert  */}
      <AlertDialog>
  <AlertDialogTrigger asChild>
  <button
                  onClick={() => setSelectedGig(gig.id)}
                  className="flex items-center text-red-600 border border-red-500 p-1 rounded hover:bg-red-100"
                >
                  <X className="mr-1" /> Reject
                </button>
  </AlertDialogTrigger>
  <AlertDialogContent className="bg-white text-black">
    <AlertDialogHeader>
      <AlertDialogTitle>Please Confirm!</AlertDialogTitle>
      <AlertDialogDescription>
        Are you sure you want to reject this gig request?
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel className="bg-white text-black rounded">
        Cancel
      </AlertDialogCancel>
      <AlertDialogAction
        className="bg-black text-white rounded hover:bg-gray-800"
        onClick={handleReject}
      >
        Yes, Reject
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>  
              </div>
              
            )}
            <div className="flex gap-4 mt-2 justify-between items-center">
              <p className="bg-gray-200 p-1 w-1/2 rounded">
                Disclaimer: Mark as completed only when you have finished the gig work and send it for approval to the client.
              </p>
              {
                gig.status === "progress" &&
                <Button className="text-white w-40 p-1 text-sm bg-black hover:bg-gray-800 rounded">
                      <Bookmark />Mark as Completed
                    </Button>
              }
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignedGigsPage;
