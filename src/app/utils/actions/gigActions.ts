import { firestore } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Type for gig data
type GigData = {
  title: string;
  description: string;
  amount: number;
};

// Action to post a new gig to Firestore
export const postGig = async (gigData: GigData) => {
  try {
    const gigsCollectionRef = collection(firestore, "gigs");
    const docRef = await addDoc(gigsCollectionRef, gigData);
    return {
      success: true,
      message: "Gig posted successfully",
      gigId: docRef.id,
    };
  } catch (error) {
    console.error("Error posting gig:", error);
    throw new Error("Failed to post gig");
  }
};

// Action to fetch all gigs from Firestore
export const fetchGigs = async () => {
  try {
    const gigsCollectionRef = collection(firestore, "gigs");
    const gigsSnapshot = await getDocs(gigsCollectionRef);
    const gigsList = gigsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return gigsList;
  } catch (error) {
    console.error("Error fetching gigs:", error);
    throw new Error("Failed to fetch gigs");
  }
};
