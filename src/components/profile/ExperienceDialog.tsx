"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react"; // Import Briefcase icon from lucide-react
import { firestore } from "@/app/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExperienceDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExperienceDialog: React.FC<ExperienceDialogProps> = ({ isOpen, onClose }) => {
  const [experience, setExperience] = useState("");
  const [uid, setUid] = useState<string | null>(null); // State for UID

  // Get UID from localStorage once the component mounts (client-side)
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleSubmit = async () => {
    if (experience.trim() && uid) {
      try {
        // Reference to the user document based on UID
        const userDocRef = doc(firestore, "users", uid);

        // Update the user's experience information in Firestore
        await updateDoc(userDocRef, {
          experience: experience, // Add experience to the user's document
        });

        setExperience(""); // Clear the input after successful submission
        alert("Experience added successfully!");

        // Reload the window to reflect changes
        window.location.reload();

        onClose(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update experience. Please try again.");
      }
    } else {
      alert("Please enter a valid experience or ensure you're logged in.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add Experience</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex items-center space-x-3">
          <Briefcase className="text-2xl text-black" /> {/* Briefcase icon */}
          <Input
            type="text"
            placeholder="Enter your experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-950 text-white px-6 py-2 rounded hover:bg-purple-900"
          >
            Add Experience
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceDialog;