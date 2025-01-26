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
  MessageSquareMore, // Import Notification icon from lucide-react
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
            href: "/assigned-gigs",
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
            href: "/completed-gigs",
            icon: CheckCircle,
          },
          {
            id: "messaging",
            label: "Messaging",
            href: "/messaging",
            icon: MessageSquareMore, // Messaging icon
          },
          { id: "profile", label: "Profile", href: "/profile", icon: User },
          {
            id: "wallet",
            label: "Wallet",
            href: "/wallet",
            icon: CreditCard, // You can use a wallet icon here
          },
          {
            id: "notifications",
            label: "Notifications",
            href: "/notifications",
            icon: Bell, // Notification icon
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
                      ? "bg-purple-200 !hover:bg-purple-200"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => handleActiveItem(item.id)} // Set active item on click
                >
                  <Icon size={20} className="mr-3" strokeWidth={3} />
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
            className="mt-4 font-semibold text-white bg-purple-950 hover:bg-purple-900 rounded text-base w-full flex p-2 items-center justify-center gap-2"
            onClick={handleOpenDialog}
          >
            <Plus size={22} />
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
