"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { MapPin } from "lucide-react"; // Import MapPin icon from lucide-react
import { firestore } from "@/app/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface LocationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const LocationDialog: React.FC<LocationDialogProps> = ({ isOpen, onClose }) => {
  const [location, setLocation] = useState("");
  const [uid, setUid] = useState<string | null>(null); // State for UID

  // Get UID from localStorage once the component mounts (client-side)
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleSubmit = async () => {
    if (location.trim() && uid) {
      try {
        // Reference to the user document based on UID
        const userDocRef = doc(firestore, "users", uid);

        // Update the user's location information in Firestore
        await updateDoc(userDocRef, {
          location: location, // Add location to the user's document
        });

        setLocation(""); // Clear the input after successful submission
        alert("Location added successfully!");

        // Reload the window to reflect changes
        window.location.reload();

        onClose(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update location. Please try again.");
      }
    } else {
      alert("Please enter a valid location or ensure you're logged in.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add Location</DialogTitle>
        </DialogHeader>
        <div className="mt-4 flex items-center space-x-3">
          <MapPin className="text-2xl text-black" />
          <Input
            type="text"
            placeholder="Enter your location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
          />
        </div>
        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Add Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationDialog;
