// src/components/GigForm.tsx
import React from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { postGig } from "@/app/utils/actions/gigActions";

type GigFormInputs = {
  title: string;
  description: string;
  amount: number;
};

type GigFormProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GigForm({ isOpen, onClose }: GigFormProps) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<GigFormInputs>({
    defaultValues: {
      title: "",
      description: "",
      amount: 0,
    },
  });

  const onSubmit = async (data: GigFormInputs) => {
    try {
      // Call the postGig action to post data to Firebase
      const result = await postGig(data);

      if (result.success) {
        console.log("Gig posted successfully:", result);
        onClose(); // Close the dialog on success
      } else {
        console.error("Error posting gig:", result.message);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto rounded-lg shadow-lg p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            List a Gig
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to post a gig on the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Gig Title
            </Label>
            <Input
              id="title"
              placeholder="Enter gig title"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              {...register("title", { required: "Title is required" })}
            />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <Label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter gig description"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              {...register("description", {
                required: "Description is required",
              })}
            />
            {errors.description && (
              <p className="text-xs text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Amount Field */}
          <div className="space-y-2">
            <Label
              htmlFor="amount"
              className="text-sm font-medium text-gray-700"
            >
              Amount to be Paid (USD)
            </Label>
            <Input
              type="number"
              id="amount"
              placeholder="Enter amount"
              className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              {...register("amount", {
                required: "Amount is required",
                min: { value: 1, message: "Amount must be at least $1" },
              })}
            />
            {errors.amount && (
              <p className="text-xs text-red-500">{errors.amount.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            Submit Gig
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
