"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { User } from "lucide-react"; // Import User icon from lucide-react
import { firestore } from "@/app/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface BioDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BioDialog: React.FC<BioDialogProps> = ({ isOpen, onClose }) => {
  const [bio, setBio] = useState("");
  const [uid, setUid] = useState<string | null>(null); // State for UID

  // Get UID from localStorage once the component mounts (client-side)
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleSubmit = async () => {
    if (bio.trim() && uid) {
      try {
        // Reference to the user document based on UID
        const userDocRef = doc(firestore, "users", uid);

        // Update the user's bio information in Firestore
        await updateDoc(userDocRef, {
          bio: bio, // Add bio to the user's document
        });

        setBio(""); // Clear the input after successful submission
        alert("Bio added successfully!");

        // Reload the window to reflect changes
        window.location.reload();

        onClose(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update bio. Please try again.");
      }
    } else {
      alert("Please enter a valid bio or ensure you're logged in.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add Bio</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex items-center space-x-3">
          <User className="text-2xl text-black" /> {/* User icon */}
          <Input
            type="text"
            placeholder="Enter your bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-950 text-white px-6 py-2 rounded hover:bg-purple-900"
          >
            Add Bio
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BioDialog;
