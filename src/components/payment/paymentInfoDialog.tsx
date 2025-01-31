"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { fetchUser } from "@/app/utils/actions/authActions";
import { getFreelancerPaymentDetails } from "@/app/utils/actions/paymentActions";
import Image from "next/image";
import { PaymentInfo, User } from "@/app/utils/types";

interface PaymentInfoDialogProps {
  freelancerId: string;
  isOpen: boolean;
  onClose: (open: boolean) => void;
}

const PaymentInfoDialog: React.FC<PaymentInfoDialogProps> = ({ freelancerId, isOpen, onClose }) => {
  const [freelancer, setFreelancer] = useState<User | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<{ type: string; value: string | any } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDetails = async () => {
      try {
        const freelancerData = await fetchUser(freelancerId);
        setFreelancer(freelancerData);

        const paymentData = await getFreelancerPaymentDetails(freelancerId);
        setPaymentDetails(paymentData);
      } catch (err) {
        console.error("Error fetching details:", err);
        setError("Failed to fetch payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [freelancerId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-6 rounded-lg border border-gray-300">
        <DialogTitle></DialogTitle>
        <DialogHeader className="flex flex-col items-center">
          {freelancer && (
            <>
              <Image
                src={freelancer.profilePicture || "/default-avatar.png"}
                alt={freelancer.name}
                width={60}
                height={60}
                className="w-16 h-16 rounded-full border border-gray-300"
              />
              <DialogTitle className="text-xl font-semibold text-center mb-2">{freelancer.name}'s Payment Details</DialogTitle>
            </>
          )}
        </DialogHeader>

        {loading ? (
          <p className="text-center">Loading payment details...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : paymentDetails ? (
          <div className="flex flex-col items-center space-y-4 w-full">
            {paymentDetails.type === "UPI" ? (
              <div className="w-full bg-gray-100 p-4 rounded-lg flex items-center gap-3">
                <Image src="/upi.svg" alt="UPI" width={30} height={30} className="w-8 h-8" />
                <p className="text-black">
                  UPI ID: <span className="font-semibold">{paymentDetails.value}</span>
                </p>
              </div>
            ) : paymentDetails.type === "Bank" ? (
              <div className="w-full bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src="/bank.svg" alt="Bank" width={30} height={30} className="w-8 h-8" />
                  <p className="text-black font-medium">Bank Account Details</p>
                </div>
                <p className="text-black">
                  <strong>Account Holder:</strong> {paymentDetails.value.accountHolder}
                </p>
                <p className="text-black">
                  <strong>Account No:</strong> {paymentDetails.value.accountNo}
                </p>
                <p className="text-black">
                  <strong>IFSC Code:</strong> {paymentDetails.value.ifsc}
                </p>
              </div>
            ) : (
              <p className="text-gray-500">No payment details available.</p>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-center">Freelancer details not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentInfoDialog;
