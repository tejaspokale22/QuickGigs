import { firestore } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

// Type for gig data with ID
type GigData = {
  title: string;
  description: string;
  skillsRequired: string[];
  price: number;
  deadline: Timestamp;
  status: string;
  clientId: string;
  createdAt: Timestamp;
};

//Post a Gig
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

//Fetch all Gigs
export const fetchGigs = async (): Promise<GigData[]> => {
  try {
    const gigsCollectionRef = collection(firestore, "gigs");
    const gigsSnapshot = await getDocs(gigsCollectionRef);
    const gigsList = gigsSnapshot.docs.map((doc) => {
      const data = doc.data() as Omit<GigData, "id">; // Ensure the data matches GigData type
      return {
        id: doc.id,
        ...data,
      };
    });
    return gigsList;
  } catch (error) {
    console.error("Error fetching gigs:", error);
    throw new Error("Failed to fetch gigs");
  }
};
