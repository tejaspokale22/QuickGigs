"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { firestore } from "@/app/utils/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SkillsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const SkillsDialog: React.FC<SkillsDialogProps> = ({ isOpen, onClose }) => {
  const [skills, setSkills] = useState<string[]>([]); // State to hold skills array
  const [newSkill, setNewSkill] = useState<string>(""); // State for new skill input
  const [uid, setUid] = useState<string | null>(null); // State for UID

  // Get UID from localStorage once the component mounts (client-side)
  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if (storedUid) {
      setUid(storedUid);
    }
  }, []);

  // Fetch current skills from Firestore when the component mounts
  useEffect(() => {
    if (uid) {
      const fetchSkills = async () => {
        try {
          const userDocRef = doc(firestore, "users", uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const userSkills = docSnapshot.data()?.skills || [];
            setSkills(userSkills);
          }
        } catch (error) {
          console.error("Error fetching skills:", error);
        }
      };
      fetchSkills();
    }
  }, [uid]);

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills((prevSkills) => [...prevSkills, newSkill.trim()]);
      setNewSkill(""); // Clear input after adding
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills((prevSkills) => prevSkills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async () => {
    if (skills.length > 0 && uid) {
      try {
        const userDocRef = doc(firestore, "users", uid);

        // Update the user's skills in Firestore
        await updateDoc(userDocRef, {
          skills: skills, // Save the skills array
        });

        alert("Skills updated successfully!");
        onClose(); // Close the dialog after submission
      } catch (error) {
        console.error("Error updating skills:", error);
        alert("Failed to update skills. Please try again.");
      }
    } else {
      alert("Please enter at least one skill.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">Add Skills</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="Enter a new skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="w-full border border-gray-400 focus:border-2 focus:border-black rounded-md"
          />
          <Button
            onClick={handleAddSkill}
            className="mt-2 bg-purple-950 text-white px-6 py-2 rounded hover:bg-purple-900"
          >
            Add Skill
          </Button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-semibold">Current Skills:</h3>
          <ul className="mt-2">
            {skills.map((skill, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{skill}</span>
                <button
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            onClick={handleSubmit}
            className="bg-purple-950 text-white px-6 py-2 rounded hover:bg-purple-900"
          >
            Save Skills
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SkillsDialog;
