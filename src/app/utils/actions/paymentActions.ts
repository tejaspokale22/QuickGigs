import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import {
  collection,
  getDoc,
  addDoc,
  getDocs,
  updateDoc,
  arrayUnion,
  query,
  where,
} from "firebase/firestore";

interface BankDetails {
  name: string;
  accountNo: string;
  ifsc: string;
}

export async function saveUpiId(userId: string, upiId: string) {
  try {
    if (!userId || !upiId) {
      throw new Error("User ID and UPI ID are required");
    }

    const paymentRef = doc(firestore, "payments", userId);
    await setDoc(paymentRef, { userId, upiId }, { merge: true });

    return { success: true, message: "UPI ID saved successfully" };
  } catch (error) {
    console.error("Error saving upi ID:", error);
    throw new Error("Failed to save upi ID.");
  }
}

export async function saveBankDetails(
  userId: string,
  bankDetails: BankDetails
) {
  try {
    if (!userId || !bankDetails) {
      throw new Error("User ID and bank details are required");
    }

    const paymentRef = doc(firestore, "payments", userId);
    await setDoc(paymentRef, { userId, bankDetails }, { merge: true });

    return { success: true, message: "Bank details saved successfully" };
  } catch (error) {
    console.error("Error saving bank details", error);
    throw new Error("Error saving bank details");
  }
}

// Get freelancer payment details
export const getFreelancerPaymentDetails = async (freelancerId: string) => {
  try {
    // Query the payments collection where userId matches the freelancerId
    const paymentsQuery = query(
      collection(firestore, "payments"),
      where("userId", "==", freelancerId)
    );

    const querySnapshot = await getDocs(paymentsQuery);
    if (querySnapshot.empty) {
      throw new Error("No payment details found for this freelancer.");
    }

    let paymentDetails = null;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.upiId) {
        paymentDetails = { type: "UPI", value: data.upiId };
      } else if (data.bankDetails) {
        paymentDetails = { type: "Bank", value: data.bankDetails };
      }
    });

    if (!paymentDetails) {
      throw new Error("No valid payment details found.");
    }

    return paymentDetails;
  } catch (error) {
    console.error("Error fetching freelancer payment details:", error);
    throw new Error("Failed to retrieve payment details.");
  }
};
