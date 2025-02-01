"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  House,
  ArrowsUpFromLine,
  User,
  CheckCircle,
  CalendarCheck,
  Plus,
  CreditCard,
  Upload,
  FileText,
  Bell,
  MessageSquareMore,
  IndianRupee, // Import Notification icon from lucide-react
} from "lucide-react"; // Import icons from lucide-react
import { auth } from "@/app/utils/firebase"; // Import Firebase auth
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase's auth state listener
import GigForm from "./GigForm";

// Main LeftSidebar component
const LeftSidebar: React.FC = () => {
  const [user, setUser] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );
  const [activeItem, setActiveItem] = useState<string>("home"); // Track active menu item
  const [uid, setUid] = useState<string | null>(null); // State to hold uid

  //Dialog for GigForm
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(!!user);
      localStorage.setItem("isAuthenticated", user ? "true" : "false");
      if (user) {
        setUid(user.uid); // Set uid from user object
      } else {
        setUid(null); // Clear uid if no user
      }
    });

    return () => unsubscribe();
  }, []);

  // Define the menu items (conditionally add the items based on authentication)
  const menuItems = [
    { id: "home", label: "Home", href: "/", icon: House },
    {
      id: "apply-gig",
      label: "Apply a Gig",
      href: "/gigs",
      icon: ArrowsUpFromLine, // You can replace this with a logo
    },
    ...(user
      ? [
          {
            id: "assigned-gigs",
            label: "Assigned Gigs",
            href: `/assigned-gigs/${uid}`,
            icon: CalendarCheck,
          },
          {
            id: "posted-gigs",
            label: "Posted Gigs",
            href: "/posted-gigs",
            icon: Upload,
          },
          {
            id: "applied-gigs",
            label: "Applied Gigs",
            href: "/applied-gigs",
            icon: FileText,
          },
          {
            id: "completed-gigs",
            label: "Completed Gigs",
            href: `/completed-gigs/${uid}`,
            icon: CheckCircle,
          },
          {
            id: "messaging",
            label: "Messaging",
            href: `/messaging/${uid}`,
            icon: MessageSquareMore, 
          },
          { id: "profile", label: "Profile", href: "/profile", icon: User },
          {
            id: "getpaid",
            label: "Get Paid",
            href: "/paymentdetails",
            icon: IndianRupee, 
          },
          {
            id: "notifications",
            label: "Notifications",
            href: "/notifications",
            icon: Bell, 
          },
        ]
      : []),
  ];

  // Handle setting active item
  const handleActiveItem = (id: string) => {
    setActiveItem(id);
  };

  return (
    <aside className="w-1/6 bg-white shadow-lg rounded-lg p-4 border-r border-gray-400 fixed top-[50px] h-[calc(100vh-50px)]">
      <ul className="space-y-2">
        {/* Render the menu items */}
        {menuItems.map((item) => {
          const Icon = item.icon; // Access the icon component dynamically
          return (
            <li key={item.id}>
              <Link href={item.href}>
                <div
                  className={`font-medium w-full flex items-center text-left rounded text-base p-2 ${
                    activeItem === item.id
                      ? "bg-gray-300 !hover:bg-purple-200"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleActiveItem(item.id)} // Set active item on click
                >
                  <Icon size={20} className="mr-3" strokeWidth={2} />
                  <span className="text-base">{item.label}</span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 'Post a Gig' button outside of the menu items */}
      {user && (
        <Link href="/">
          <button
            className="mt-4 font-semibold text-white bg-black hover:bg-gray-800 rounded text-base w-full flex p-2 items-center justify-center gap-2"
            onClick={handleOpenDialog}
          >
            <Plus size={22} strokeWidth={3} />
            Post a Gig
          </button>
        </Link>
      )}

      {/* GigForm Dialog */}
      <GigForm isOpen={isDialogOpen} onClose={handleCloseDialog} />

    </aside>
  );
};

export default LeftSidebar;
