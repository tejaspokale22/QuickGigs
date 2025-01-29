"use client"
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {Input} from '@/components/ui/input';
import { Button } from "../ui/button";
import { createNewChat } from "@/app/utils/actions/chatActions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog";
import { log } from "console";


type NewChatForm = {
  email: string;
}

type NewChatProps = {
    isOpen: boolean;
    onClose: () => void;
  };
  

const CreateChatDialog = ({ isOpen, onClose }: NewChatProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors },reset} = useForm<NewChatForm>();

  const onSubmit = async (data: NewChatForm) => {
    setLoading(true);
    setError(null);

    try {
      // Get the user UID from localStorage
      const uid = localStorage.getItem('uid');
      if (!uid) {
        throw new Error("User UID not found in localStorage.");
      }

      // Call the createNewChat action
      const response = await createNewChat(data.email, uid);
      console.log(response);
      if(response){
        alert(response.message);
        reset(); // Reset the form after successful submission
        onClose(); // Close the dialog on success
      }
      // window.location.reload(); // Reload the website after closing the dialog
    } catch (error: any) {
      setError(error.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto rounded-lg shadow-lg p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Add a User
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Enter email of the user with whom you want to start chat.
          </DialogDescription>
        </DialogHeader>
       
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter user email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 block w-full"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="mt-4 flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 text-white bg-black hover:bg-gray-800"
            >
              {loading ? "Creating Chat..." : "Add User"}
            </Button>
          </div>
          {error && (
            <p className="text-sm text-red-600 text-center mt-2">{error}</p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatDialog;

