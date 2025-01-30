import { firestore } from "@/app/utils/firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { User } from "../types";

//Fetch a User
export const fetchUser = async (uid: string): Promise<User> => {
  if (!uid) {
    throw new Error("User UID is required.");
  }

  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data() as User;
  } else {
    throw new Error("User not found in the database.");
  }
};

//Fetch all Users
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const usersCollection = collection(firestore, "users"); // Access the "users" collection
    const usersSnapshot = await getDocs(usersCollection); // Fetch all documents

    const usersList: User[] = usersSnapshot.docs.map((doc) => {
      const data = doc.data(); // Firestore document data
      return {
        uid: data.uid,
        name: data.name,
        email: data.email,
        profilePicture: data.profilePicture || undefined,
      };
    });

    return usersList; // Return a valid User[]
  } catch (error: any) {
    console.error("Error fetching users:", error);
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};
