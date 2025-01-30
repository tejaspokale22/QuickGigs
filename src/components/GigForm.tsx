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
import { Timestamp } from "firebase/firestore";

type GigFormInputs = {
  title: string;
  description: string;
  skillsRequired: string;
  price: number;
  deadline: string;
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
    reset,
  } = useForm<GigFormInputs>({});

  const onSubmit = async (data: GigFormInputs) => {
    try {
      const uid= localStorage.getItem("uid");
      if (!uid) throw new Error("User not authenticated");

      const skillsArray = data.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      const deadlineTimestamp = Timestamp.fromDate(new Date(data.deadline));

      const result = await postGig({
        title: data.title,
        description: data.description,
        skillsRequired: skillsArray,
        price: data.price,
        deadline: deadlineTimestamp,
        status: "pending",
        clientId: uid,
        freelancerId:"",
        createdAt: Timestamp.now()
      });

      if (result.success) {
        console.log("Gig posted successfully:", result);
        reset(); // Reset the form after successful submission
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
            Post a Gig
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to post a gig on the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-700">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Enter gig title"
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
              placeholder="Enter detailed description of the work"
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

          {/* Skills Field */}
          <div className="space-y-2">
            <Label
              htmlFor="skills"
              className="text-sm font-medium text-gray-700"
            >
              Skills Required
            </Label>
            <Input
              id="skills"
              placeholder="Enter skills necessary (comma separated)"
              {...register("skillsRequired", { required: "Skills are required" })}
            />
            {errors.skillsRequired && (
              <p className="text-xs text-red-500">
                {errors.skillsRequired.message}
              </p>
            )}
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
              Price (INR)
            </Label>
            <Input
              type="number"
              id="price"
              placeholder="Enter price"
              {...register("price", {
                required: "Price is required",
                min: { value: 50, message: "Price must be at least ₹50" },
              })}
            />
            {errors.price && (
              <p className="text-xs text-red-500">{errors.price.message}</p>
            )}
          </div>

          {/* Deadline Field */}
          <div className="space-y-2">
            <Label
              htmlFor="deadline"
              className="text-sm font-medium text-gray-700"
            >
              Deadline
            </Label>
            <Input
              type="date"
              id="deadline"
              {...register("deadline", { required: "Deadline is required" })}
            />
            {errors.deadline && (
              <p className="text-xs text-red-500">{errors.deadline.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-purple-950 text-white py-2 rounded-md hover:bg-purple-900"
          >
            Submit Gig
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
