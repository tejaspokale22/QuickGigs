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
import { Upload, X, Loader2 } from "lucide-react";

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
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [searchSkill, setSearchSkill] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const onSubmit = async (data: GigFormInputs) => {
    try {
      setIsSubmitting(true);
      const uid = localStorage.getItem("uid");
      if (!uid) throw new Error("User not authenticated");

      const deadlineTimestamp = Timestamp.fromDate(new Date(data.deadline));
      const attachmentsArray = selectedFiles ? Array.from(selectedFiles) : [];

      const result = await postGig(
        {
          title: data.title,
          description: data.description,
          skillsRequired: selectedSkills,
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
        attachmentsArray
      );

      if (result) {
        reset();
        setSelectedFiles(null);
        setSelectedSkills([]);
        onClose();
      }
    } catch (error) {
      console.error("Error posting gig:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded p-6">
        <DialogHeader className="space-y-2 mb-4">
          <DialogTitle className="text-xl font-semibold text-gray-900">Post a Gig</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Fill in the details below to create a new gig opportunity.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid gap-4">
            {/* Title and Description Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Title Field */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-900">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Enter a clear title for your gig"
                  className="border-gray-200 focus:border-black focus:ring-black"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-xs text-red-500">{errors.title.message}</p>
                )}
              </div>

              {/* Skills Field */}
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-900">
                  Required Skills
                </Label>
                <Input
                  id="skills"
                  placeholder="React, Node.js, UI Design"
                  className="border-gray-200 focus:border-black focus:ring-black"
                  {...register("skillsRequired", { required: "Skills are required" })}
                />
                {errors.skillsRequired && (
                  <p className="text-xs text-red-500">{errors.skillsRequired.message}</p>
                )}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-900">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe the project requirements and expectations"
                className="h-24 border-gray-200 focus:border-black focus:ring-black resize-none"
                {...register("description", { required: "Description is required" })}
              />
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description.message}</p>
              )}
            </div>

            {/* Price, Deadline and Upload Row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-gray-900">
                  Payout (₹)
                </Label>
                <Input
                  type="number"
                  id="price"
                  placeholder="Enter payout amount"
                  className="border-gray-200 focus:border-black focus:ring-black"
                  {...register("price", {
                    required: "Payout amount is required",
                    min: { value: 50, message: "Minimum ₹50" }
                  })}
                />
                {errors.price && (
                  <p className="text-xs text-red-500">{errors.price.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline" className="text-sm font-medium text-gray-900">
                  Deadline
                </Label>
                <Input
                  type="date"
                  id="deadline"
                  className="border-gray-200 focus:border-black focus:ring-black"
                  {...register("deadline", { required: "Deadline is required" })}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500">{errors.deadline.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="attachments" className="text-sm font-medium text-gray-900">
                  Attachments
                </Label>
                <div className="border-2 border-dashed border-gray-200 rounded p-3 hover:border-gray-300 transition-colors h-[38px] flex items-center justify-center">
                  <Input
                    type="file"
                    id="attachments"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="attachments" className="flex items-center gap-2 cursor-pointer">
                    <Upload className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {selectedFiles ? `${selectedFiles.length} files selected` : 'Upload files'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition-colors mt-2 relative"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Posting Gig...
              </>
            ) : (
              'Post Gig'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
