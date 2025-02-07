import React, { useState } from "react";
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
  const { handleSubmit, register, formState: { errors }, reset } = useForm<GigFormInputs>({});
  
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const onSubmit = async (data: GigFormInputs) => {
    try {
      const uid = localStorage.getItem("uid");
      if (!uid) throw new Error("User not authenticated");

      // Convert comma-separated skills into an array
      const skillsArray = data.skillsRequired
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill !== "");

      // Convert deadline to Firestore Timestamp
      const deadlineTimestamp = Timestamp.fromDate(new Date(data.deadline));

      // Ensure attachments are properly handled
      const attachmentsArray = selectedFiles ? Array.from(selectedFiles) : [];

      console.log("Files Selected:", attachmentsArray); // Debugging log

      const result = await postGig(
        {
          title: data.title,
          description: data.description,
          skillsRequired: skillsArray,
          price: data.price,
          deadline: deadlineTimestamp,
          status: "pending",
          clientId: uid,
          freelancerId: "",
          createdAt: Timestamp.now(),
          appliedFreelancers: [],
          paymentStatus: false,
          workStatus: false,
        },
        attachmentsArray // ✅ Pass actual file objects
      );

      if (result) {
        console.log("Gig posted successfully:", result);
        reset();
        setSelectedFiles(null); // Clear file state
        onClose();
      } else {
        console.error("Error posting gig:", result);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto rounded-lg shadow-lg p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Post a Gig</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to post a gig on the platform.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="Enter gig title" {...register("title", { required: "Title is required" })} />
            {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Enter details" {...register("description", { required: "Description is required" })} />
            {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">Skills Required</Label>
            <Input id="skills" placeholder="Comma-separated skills" {...register("skillsRequired", { required: "Skills are required" })} />
            {errors.skillsRequired && <p className="text-xs text-red-500">{errors.skillsRequired.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price (INR)</Label>
            <Input type="number" id="price" placeholder="Enter price" {...register("price", { required: "Price is required", min: { value: 50, message: "Minimum ₹50" } })} />
            {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input type="date" id="deadline" {...register("deadline", { required: "Deadline is required" })} />
            {errors.deadline && <p className="text-xs text-red-500">{errors.deadline.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="attachments">Attachments</Label>
            <Input type="file" id="attachments" multiple onChange={handleFileChange} />
          </div>

          <Button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
            Submit Gig
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
