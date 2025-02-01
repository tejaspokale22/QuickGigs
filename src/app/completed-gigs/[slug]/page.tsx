"use client"

import { useEffect, useState } from "react";
import { Gig, User } from "@/app/utils/types";
import { useParams } from "next/navigation";
import { formatDeadline } from "@/app/utils/utilityFunctions";
import { firestore } from "@/app/utils/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { fetchUser } from "@/app/utils/actions/authActions";
import { CheckCircle, Mail } from "lucide-react"; // Importing the X icon
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { approvePayment } from "@/app/utils/actions/paymentActions";

const CompletedGigsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<{ [key: string]: User }>({});
  const [selectedGig,setSelectedGig] = useState<string | null>(null);  

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
    return <p className="text-center text-lg text-gray-600 mt-10">Loading completed gigs...</p>;
  if (error)
    return <p className="text-center text-red-500 text-lg mt-10">{error}</p>;
  if (gigs.length === 0)
    return <p className="text-center text-lg text-gray-500 mt-10">No completed gigs found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
        Completed Gigs
      </h2>
      <ul className="space-y-6">
        {gigs.map((gig) => (
          (gig.status==="completed") &&
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
            <div className="flex gap-4 mt-2 justify-between items-center">
              {gig.workStatus===false &&
              <p className="bg-gray-200 p-1 w-1/2 rounded">
              Waiting for the client to approve you work
              </p>
              }
              {gig.workStatus===true &&
              <p className="bg-gray-200 p-1 w-1/2 rounded">
              Your work has been successfully approved!
              </p>
              }
              {
                (gig.workStatus===true && gig.paymentStatus===false) &&
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                  <Button className="text-white w-40 p-1 text-sm bg-black hover:bg-gray-800 rounded"
                  onClick={() => setSelectedGig(gig.id)}
                  >
                      Approve Payout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-white text-black">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Please Confirm!</AlertDialogTitle>
                      <AlertDialogDescription>
                        Only approve if you have received the payment from the client!
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-white text-black rounded">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-black text-white rounded hover:bg-gray-800"
                        onClick={handleApprovePayment}
                      >
                        Yes, Approve
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
              {
                gig.paymentStatus===true &&
                <Button className="text-white w-40 p-1 text-sm bg-black hover:bg-gray-800 rounded"
                disabled={true}
                  >
                    <CheckCircle/> Payment Done
                    </Button>
              }
            </div>

          </li>
        ))}
      </ul>
    </div>
  );
};

export default CompletedGigsPage;