"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./Logo";
import { auth, signOut } from "@/app/utils/firebase"; // Adjust the import path for Firebase
import { onAuthStateChanged } from "firebase/auth"; // Import Firebase's auth state listener

const Header: React.FC = () => {
  // Initialize authentication state from localStorage
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    // Listen for changes in auth state from Firebase
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Set auth state based on the user object
      localStorage.setItem("isAuthenticated", user ? "true" : "false"); // Sync with localStorage
    });

    // Clean up the listener on component unmount
    return () => unsubscribe();
  }, []);

  // Logout function
  const handleLogout = async () => {
    await signOut(auth); // Sign out the user
    localStorage.removeItem("isAuthenticated"); // Clear the stored auth state
  };

  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-[7px] bg-white border-b border-gray-400 z-50">
      {/* Logo Section */}
      <div className="flex items-center ml-4">
        <Logo />
      </div>

      {/* Navigation Section */}
      <nav className="mr-4 flex items-center justify-center gap-3">
        {/* Conditional Button */}
        {isAuthenticated ? (
          <Button
            onClick={handleLogout}
            className="bg-transparent text-red-700 border border-red-700 px-3 py-2 text-md hover:bg-red-100 hover:text-red-700 rounded transition duration-75"
            variant="outline"
          >
            Logout
          </Button>
        ) : (
          <Link href="/login">
            <Button
              className="bg-black text-white px-5 py-3 text-md shadow-md hover:bg-gray-800 rounded transition duration-75"
              variant="default"
            >
              Login
            </Button>
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;
