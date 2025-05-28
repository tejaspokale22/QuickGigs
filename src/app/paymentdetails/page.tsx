"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, Camera } from "lucide-react";
import Image from "next/image";
import upi from "../../../public/upi.svg";
import bank from "../../../public/bank.svg";
import { saveUpiId, saveBankDetails, getFreelancerPaymentDetails } from "@/app/utils/actions/paymentActions";
import { fetchUser } from "@/app/utils/actions/authActions";
import { User } from "@/app/utils/types";
import Spinner from "@/components/ui/spinner";

type PaymentMethod = {
  type: string;
  value: string | {
    name: string;
    accountNo: string;
    ifsc: string;
  };
};

type PaymentDetails = {
  upiDetails: PaymentMethod | null;
  bankDetails: PaymentMethod | null;
};

type PaymentResponse = PaymentDetails | string;

export default function PaymentSetupDialog() {
  const [tab, setTab] = useState("upi");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [paymentInfo, setPaymentInfo] = useState<PaymentDetails | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userId = localStorage.getItem("uid");
        if (!userId) {
          setLoading(false);
          return;
        }
        const userData = await fetchUser(userId);
        setUserProfile(userData);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPaymentInfo = async () => {
      try {
        const userId = localStorage.getItem("uid");
        if (!userId) {
          setPaymentLoading(false);
          return;
        }
        const paymentData = await getFreelancerPaymentDetails(userId) as PaymentResponse;
        if (typeof paymentData === 'string') {
          setPaymentInfo(null);
        } else {
          setPaymentInfo(paymentData);
        }
      } catch (error) {
        console.error("Error fetching payment info:", error);
        setPaymentInfo(null);
      } finally {
        setPaymentLoading(false);
      }
    };

    fetchUserProfile();
    fetchPaymentInfo();
  }, []);

  // Form setup for UPI ID
  const {
    register: registerUpi,
    handleSubmit: handleSubmitUpi,
    formState: { errors: errorsUpi },
  } = useForm();

  // Form setup for Bank Details
  const {
    register: registerBank,
    handleSubmit: handleSubmitBank,
    formState: { errors: errorsBank },
  } = useForm();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Handle UPI Submission
  const onSubmitUpi = async (data: any) => {
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      await saveUpiId(userId, data.upiId);
      toast({
        title: "Success",
        description: "UPI ID saved successfully!",
        className: "bg-white text-black flex items-center",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save UPI ID",
        variant: "destructive",
      });
    }
  };

  // Handle Bank Details Submission
  const onSubmitBank = async (data: any) => {
    try {
      const userId = localStorage.getItem("uid");
      if (!userId) {
        toast({
          title: "Error",
          description: "Please login to continue",
          variant: "destructive",
        });
        return;
      }

      const bankDetails = {
        name: data.bankName,
        accountNo: data.accountNumber,
        ifsc: data.ifscCode,
      };

      await saveBankDetails(userId, bankDetails);
      toast({
        title: "Success",
        description: "Bank details saved successfully!",
        className: "bg-white text-black flex items-center",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save bank details",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
              <p className="text-gray-600 mt-1">Manage your earnings and payment methods</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="bg-black text-white rounded hover:bg-gray-800 px-6"
                  onClick={() => setOpen(true)}
                >
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white text-black p-8 rounded-xl shadow-xl border border-gray-100">
                <DialogTitle className="text-center text-2xl font-bold mb-6">Add Payment Method</DialogTitle>
                <Tabs defaultValue="upi" className="w-full">
                  <TabsList className="grid w-full h-10 grid-cols-2 mb-6 p-1 bg-gray-50 rounded">
                    <TabsTrigger value="upi" onClick={() => setTab("upi")} className="flex justify-center data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                      <div className="w-full h-full py-3 text-black rounded flex justify-center items-center gap-2">
                        <Image src={upi} alt="UPI Icon" className="w-10 h-6" />
                        <span className="font-medium">UPI ID</span>
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="bank" onClick={() => setTab("bank")} className="flex justify-center data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all duration-200">
                      <div className="w-full h-full py-3 text-black rounded flex justify-center items-center gap-2">
                        <Image src={bank} alt="Bank Icon" className="w-6 h-6" />
                        <span className="font-medium">Bank Account</span>
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  {/* UPI ID Form */}
                  <TabsContent value="upi" className="mt-6">
                    <form onSubmit={handleSubmitUpi(onSubmitUpi)} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="upiId" className="text-sm font-medium text-gray-700">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="username@bank"
                          className="h-11 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-lg bg-gray-50/50"
                          {...registerUpi("upiId", { required: "UPI ID is required" })}
                        />
                        {errorsUpi.upiId?.message && (
                          <p className="text-red-500 text-sm mt-1.5">{String(errorsUpi.upiId.message)}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-black text-white hover:bg-gray-800 rounded font-medium transition-colors duration-200"
                      >
                        Save UPI ID
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Bank Details Form */}
                  <TabsContent value="bank" className="mt-6">
                    <form onSubmit={handleSubmitBank(onSubmitBank)} className="space-y-5">
                      <div className="space-y-2">
                        <Label htmlFor="bankName" className="text-sm font-medium text-gray-700">Account Holder Name</Label>
                        <Input
                          id="bankName"
                          placeholder="John Doe"
                          className="h-11 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-lg bg-gray-50/50"
                          {...registerBank("bankName", { required: "Account holder name is required" })}
                        />
                        {errorsBank.bankName?.message && (
                          <p className="text-red-500 text-sm mt-1.5">{String(errorsBank.bankName.message)}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter your account number"
                          type="text"
                          className="h-11 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-lg bg-gray-50/50"
                          {...registerBank("accountNumber", { required: "Account number is required" })}
                        />
                        {errorsBank.accountNumber?.message && (
                          <p className="text-red-500 text-sm mt-1.5">{String(errorsBank.accountNumber.message)}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">IFSC Code</Label>
                        <Input
                          id="ifscCode"
                          placeholder="Enter IFSC code"
                          type="text"
                          className="h-11 border border-gray-200 focus:border-black focus:ring-1 focus:ring-black rounded-lg bg-gray-50/50"
                          {...registerBank("ifscCode", { required: "IFSC code is required" })}
                        />
                        {errorsBank.ifscCode?.message && (
                          <p className="text-red-500 text-sm mt-1.5">{String(errorsBank.ifscCode.message)}</p>
                        )}
                      </div>
                      <Button 
                        type="submit" 
                        className="w-full h-11 bg-black text-white hover:bg-gray-800 rounded font-medium transition-colors duration-200"
                      >
                        Save Bank Details
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">₹5,000</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Completed Projects</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">25</p>
            <p className="mt-2 text-sm text-gray-600">Last project completed 2 days ago</p>
          </div>
          
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Average Rating</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">4.8</p>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} className="h-4 w-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            {[
              { project: "Website Redesign", amount: "₹2,000", date: "Mar 15, 2024", status: "Completed" },
              { project: "Mobile App UI", amount: "₹1,500", date: "Mar 10, 2024", status: "Pending" },
              { project: "Logo Design", amount: "₹1,500", date: "Mar 05, 2024", status: "Completed" },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{transaction.project}</p>
                  <p className="text-sm text-gray-500">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{transaction.amount}</p>
                  <p className={`text-sm ${
                    transaction.status === "Completed" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {transaction.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Profile and Payment Methods */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            {loading ? (
              <div className="h-32">
                <Spinner />
              </div>
            ) : userProfile ? (
              <div className="flex items-center gap-6">
                <div className="relative group">
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-100">
                    {userProfile.profilePicture ? (
                      <Image
                        src={userProfile.profilePicture}
                        alt={userProfile.name || "User"}
                        className="w-full h-full object-cover"
                        width={96}
                        height={96}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-semibold">
                        {getInitials(userProfile.name || "")}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-green-500 w-4 h-4 rounded-full border-2 border-white"></div>
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{userProfile.name}</h2>
                  <p className="text-gray-500">Freelancer</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-green-600">Available for work</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">Please login to view your profile</div>
            )}
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Payment Methods</h2>
            {paymentLoading ? (
              <div className="h-32">
                <Spinner />
              </div>
            ) : paymentInfo ? (
              <div className="space-y-3">
                {paymentInfo.upiDetails && typeof paymentInfo.upiDetails.value === 'string' && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image src={upi} alt="UPI" className="w-8 h-8" />
                      <div>
                        <p className="font-medium">UPI</p>
                        <p className="text-sm text-gray-500">{paymentInfo.upiDetails.value}</p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-sm rounded-full hover:bg-gray-100 transition-colors duration-200" 
                      onClick={() => setOpen(true)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
                {paymentInfo.bankDetails && typeof paymentInfo.bankDetails.value === 'object' && 'accountNo' in paymentInfo.bankDetails.value && (
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image src={bank} alt="Bank" className="w-8 h-8" />
                      <div>
                        <p className="font-medium">Bank Account</p>
                        <p className="text-sm text-gray-500">
                          Account No: {paymentInfo.bankDetails.value.accountNo}
                        </p>
                        <p className="text-xs text-gray-400">
                          IFSC: {paymentInfo.bankDetails.value.ifsc}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="text-sm rounded-full hover:bg-gray-100 transition-colors duration-200" 
                      onClick={() => setOpen(true)}
                    >
                      Edit
                    </Button>
                  </div>
                )}
                {!paymentInfo.upiDetails && !paymentInfo.bankDetails && (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">No payment methods added yet</p>
                    <Button 
                      variant="default" 
                      className="bg-black text-white hover:bg-gray-800 rounded"
                      onClick={() => setOpen(true)}
                    >
                      Add Payment Method
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No payment methods added yet</p>
                <Button 
                  variant="default" 
                  className="bg-black text-white hover:bg-gray-800 rounded"
                  onClick={() => setOpen(true)}
                >
                  Add Payment Method
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
