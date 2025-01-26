"use client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { useState, useEffect } from "react";
import { firestore } from "@/app/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Website from "../../../public/globe.svg";
import Linkedin from "../../../public/linkedin.svg";
import Instagram from "../../../public/instagram.svg";
import Github from "../../../public/github.svg";
import X from "../../../public/X.svg";

interface SocialsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SocialsDialog: React.FC<SocialsDialogProps> = ({ isOpen, onClose }) => {
  const [socials, setSocials] = useState({
    github: "",
    instagram: "",
    linkedin: "",
    twitter: "",
    website: "",
  });
  const [uid, setUid] = useState<string | null>(null); // State for UID

  // Get UID from localStorage once the component mounts (client-side)
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  const handleSubmit = async () => {
    if (uid) {
      try {
        // Reference to the user document based on UID
        const userDocRef = doc(firestore, "users", uid);

        // Update the user's social media info in Firestore
        await updateDoc(userDocRef, {
          socials: socials, // Add socials as a map
        });

        setSocials({
          github: "",
          instagram: "",
          linkedin: "",
          twitter: "",
          website: "",
        }); // Clear the inputs after successful submission
        alert("Socials added successfully!");

        // Reload the window to reflect changes
        window.location.reload();

        onClose(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating document: ", error);
        alert("Failed to update socials. Please try again.");
      }
    } else {
      alert("Please ensure you're logged in.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add Social Media Links</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {/* Website */}
          <div className="mb-4 flex items-center space-x-3">
            <Image src={Website} alt="Website" width={24} height={24} />
            <Input
              type="url"
              placeholder="Personal Website URL"
              value={socials.website}
              onChange={(e) => setSocials({ ...socials, website: e.target.value })}
              className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
            />
          </div>

          {/* LinkedIn */}
          <div className="mb-4 flex items-center space-x-3">
            <Image src={Linkedin} alt="LinkedIn" width={24} height={24} />
            <Input
              type="url"
              placeholder="LinkedIn URL"
              value={socials.linkedin}
              onChange={(e) => setSocials({ ...socials, linkedin: e.target.value })}
              className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
            />
          </div>

          {/* Instagram */}
          <div className="mb-4 flex items-center space-x-3">
            <Image src={Instagram} alt="Instagram" width={24} height={24} />
            <Input
              type="url"
              placeholder="Instagram URL"
              value={socials.instagram}
              onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
              className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
            />
          </div>

          {/* GitHub */}
          <div className="mb-4 flex items-center space-x-3">
            <Image src={Github} alt="GitHub" width={24} height={24} />
            <Input
              type="url"
              placeholder="GitHub URL"
              value={socials.github}
              onChange={(e) => setSocials({ ...socials, github: e.target.value })}
              className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
            />
          </div>

          {/* Twitter (X) */}
          <div className="mb-4 flex items-center space-x-3">
            <Image src={X} alt="Twitter" width={24} height={24} />
            <Input
              type="url"
              placeholder="Twitter URL"
              value={socials.twitter}
              onChange={(e) => setSocials({ ...socials, twitter: e.target.value })}
              className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-950 text-white px-6 py-2 rounded hover:bg-purple-900"
          >
            Add Socials
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SocialsDialog;
