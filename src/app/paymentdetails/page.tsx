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
import { CheckCircle } from "lucide-react";
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

  // Handle UPI Submission
  const onSubmitUpi = (data: any) => {
    console.log("UPI Data:", data);
    toast({
      title: "UPI ID saved successfully!",
      description: "Your UPI ID has been stored securely.",
      className: "bg-white text-black flex items-center",
      duration: 1200,
      icon: <CheckCircle className="text-green-600 w-5 h-5" />,
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
      icon: <CheckCircle className="text-green-600 w-5 h-5" />,
    });
    setOpen(false);
  };

  return (
    <>
      <Toaster />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="default"
            className="bg-black text-white rounded hover:bg-gray-800"
            onClick={() => setOpen(true)}
          >
            Setup Payment Details
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md bg-white text-black p-6 rounded-lg shadow-lg border border-gray-400">
          <DialogTitle className="text-center text-xl font-semibold">Payment Setup</DialogTitle>

          <Tabs defaultValue="upi" className="w-full mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upi" onClick={() => setTab("upi")} className="flex justify-center">
                <div className="bg-white border hover:bg-gray-200 w-full h-full py-1 text-black rounded flex justify-center items-center gap-2">
                  <Image src={upi} alt="UPI Icon" className="w-10 h-6" />
                  UPI ID
                </div>
              </TabsTrigger>
              <TabsTrigger value="bank" onClick={() => setTab("bank")} className="flex justify-center">
                <div className="bg-white border hover:bg-gray-200 w-full h-full py-1 text-black rounded flex justify-center items-center gap-2">
                  <Image src={bank} alt="Bank Icon" className="w-6 h-6" />
                  Bank Details
                </div>
              </TabsTrigger>
            </TabsList>

            {/* UPI ID Form */}
            <TabsContent value="upi">
              <form onSubmit={handleSubmitUpi(onSubmitUpi)} className="space-y-4 p-4">
                <div>
                  <Label htmlFor="upiId">UPI ID</Label>
                  <Input
                    id="upiId"
                    placeholder="yourupi@bank"
                    className="border border-gray-400 focus:border-black"
                    {...registerUpi("upiId", { required: "UPI ID is required" })}
                  />
                  {errorsUpi.upiId?.message && (
                    <p className="text-red-500 text-sm">{String(errorsUpi.upiId.message)}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded">
                  Save UPI ID
                </Button>
              </form>
            </TabsContent>

            {/* Bank Details Form */}
            <TabsContent value="bank">
              <form onSubmit={handleSubmitBank(onSubmitBank)} className="space-y-4 p-4">
                <div>
                  <Label htmlFor="bankName">Account Holder Name</Label>
                  <Input
                    id="bankName"
                    placeholder="John Doe"
                    className="border border-gray-400 focus:border-black"
                    {...registerBank("bankName", { required: "Bank name is required" })}
                  />
                  {errorsBank.bankName?.message && (
                    <p className="text-red-500 text-sm">{String(errorsBank.bankName.message)}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="123456789012"
                    type="text"
                    className="border border-gray-400 focus:border-black"
                    {...registerBank("accountNumber", { required: "Account number is required" })}
                  />
                  {errorsBank.accountNumber?.message && (
                    <p className="text-red-500 text-sm">{String(errorsBank.accountNumber.message)}</p>
                  )}
                </div>
                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 rounded">
                  Save Bank Details
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Portfolio Section */}
      <div className="border border-gray-400 p-6 mt-6 rounded-lg shadow-md bg-white">
        <h2 className="text-lg font-semibold text-center">User Portfolio</h2>
        <div className="flex items-center justify-between mt-4">
          {/* Left Section */}
          <div>
            <p className="text-black text-md font-medium">Earnings: <span className="font-bold">$5,000</span></p>
            <p className="text-black text-md font-medium">Completed Gigs: <span className="font-bold">25</span></p>
          </div>

          {/* Right Section - Profile Picture */}
          <div className="">
            <Image src={Portfolio} alt="Portfolio" className="rounded-full" width={160} />
          </div>
        </div>
      </div>
    </>
  );
}
