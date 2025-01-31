import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

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
