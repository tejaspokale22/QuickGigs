import { firestore } from "@/app/utils/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * Fetch user data from Firestore using the given UID.
 * @param uid - The UID of the user.
 * @returns The user document data or null if not found.
 * @throws Error if the data fetch fails.
 */
export const fetchUser = async (uid: string) => {
  if (!uid) {
    throw new Error("User UID is required.");
  }

  const userRef = doc(firestore, "users", uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    throw new Error("User not found in the database.");
  }
};
