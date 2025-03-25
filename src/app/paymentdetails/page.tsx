"use client";

import { useState } from "react";
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
import Portfolio from "../../../public/portfolio.jpg";

export default function PaymentSetupDialog() {
  const [tab, setTab] = useState("upi");
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

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

  // Profile Section
  const userProfile = {
    name: "John Doe",
    role: "Professional Developer",
    memberSince: "March 2024",
    avatarUrl: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&q=80" // Professional headshot from Unsplash
  };

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  // Handle UPI Submission
  const onSubmitUpi = (data: any) => {
    console.log("UPI Data:", data);
    toast({
      title: "UPI ID saved successfully!",
      description: "Your UPI ID has been stored securely.",
      className: "bg-white text-black flex items-center",
      duration: 1200,
    });
    setOpen(false);
  };

  // Handle Bank Details Submission
  const onSubmitBank = (data: any) => {
    console.log("Bank Data:", data);
    toast({
      title: "Bank details saved successfully!",
      description: "Your bank details have been securely saved.",
      className: "bg-white text-black flex items-center",
      duration: 2000,
    });
    setOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage your earnings and payment methods</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="bg-black text-white rounded-lg hover:bg-gray-800 px-6"
                  onClick={() => setOpen(true)}
                >
                  Add Payment Method
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white text-black p-6 rounded-lg shadow-lg border border-gray-200">
                <DialogTitle className="text-center text-xl font-semibold mb-4">Add Payment Method</DialogTitle>
                <Tabs defaultValue="upi" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="upi" onClick={() => setTab("upi")} className="flex justify-center">
                      <div className="bg-white border hover:bg-gray-100 w-full h-full py-2 text-black rounded-lg flex justify-center items-center gap-2">
                        <Image src={upi} alt="UPI Icon" className="w-10 h-6" />
                        UPI ID
                      </div>
                    </TabsTrigger>
                    <TabsTrigger value="bank" onClick={() => setTab("bank")} className="flex justify-center">
                      <div className="bg-white border hover:bg-gray-100 w-full h-full py-2 text-black rounded-lg flex justify-center items-center gap-2">
                        <Image src={bank} alt="Bank Icon" className="w-6 h-6" />
                        Bank Account
                      </div>
                    </TabsTrigger>
                  </TabsList>

                  {/* UPI ID Form */}
                  <TabsContent value="upi">
                    <form onSubmit={handleSubmitUpi(onSubmitUpi)} className="space-y-4">
                      <div>
                        <Label htmlFor="upiId" className="text-sm font-medium">UPI ID</Label>
                        <Input
                          id="upiId"
                          placeholder="username@bank"
                          className="mt-1 border border-gray-300 focus:border-black"
                          {...registerUpi("upiId", { required: "UPI ID is required" })}
                        />
                        {errorsUpi.upiId?.message && (
                          <p className="text-red-500 text-sm mt-1">{String(errorsUpi.upiId.message)}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-lg">
                        Save UPI ID
                      </Button>
                    </form>
                  </TabsContent>

                  {/* Bank Details Form */}
                  <TabsContent value="bank">
                    <form onSubmit={handleSubmitBank(onSubmitBank)} className="space-y-4">
                      <div>
                        <Label htmlFor="bankName" className="text-sm font-medium">Account Holder Name</Label>
                        <Input
                          id="bankName"
                          placeholder="John Doe"
                          className="mt-1 border border-gray-300 focus:border-black"
                          {...registerBank("bankName", { required: "Account holder name is required" })}
                        />
                        {errorsBank.bankName?.message && (
                          <p className="text-red-500 text-sm mt-1">{String(errorsBank.bankName.message)}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="accountNumber" className="text-sm font-medium">Account Number</Label>
                        <Input
                          id="accountNumber"
                          placeholder="Enter your account number"
                          type="text"
                          className="mt-1 border border-gray-300 focus:border-black"
                          {...registerBank("accountNumber", { required: "Account number is required" })}
                        />
                        {errorsBank.accountNumber?.message && (
                          <p className="text-red-500 text-sm mt-1">{String(errorsBank.accountNumber.message)}</p>
                        )}
                      </div>
                      <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded-lg">
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
            <div className="mt-2 text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>All payments cleared</span>
            </div>
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
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-4 border-gray-100">
                  {userProfile.avatarUrl ? (
                    <Image
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-full h-full object-cover"
                      width={96}
                      height={96}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-black text-white text-2xl font-semibold">
                      {getInitials(userProfile.name)}
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
                <p className="text-gray-500">{userProfile.role}</p>
                <p className="text-sm text-gray-600 mt-2">Member since {userProfile.memberSince}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-sm text-green-600">Available for work</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Saved Payment Methods</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src={upi} alt="UPI" className="w-8 h-8" />
                  <div>
                    <p className="font-medium">UPI</p>
                    <p className="text-sm text-gray-500">username@bank</p>
                  </div>
                </div>
                <Button variant="outline" className="text-sm">Edit</Button>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Image src={bank} alt="Bank" className="w-8 h-8" />
                  <div>
                    <p className="font-medium">Bank Account</p>
                    <p className="text-sm text-gray-500">XXXX XXXX 1234</p>
                  </div>
                </div>
                <Button variant="outline" className="text-sm">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
