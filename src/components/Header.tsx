"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import Logo from "./Logo";

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-between p-[7px] bg-white border-b border-gray-400 shadow-md z-50">
      {/* Logo Section */}
      <div className="flex items-center ml-4">
        <Logo />
      </div>

      {/* Navigation Section */}
      <nav className="mr-4 flex items-center justify-center gap-3">
        {/* Login Button */}
        <Link href="/login">
          <Button
            className="bg-purple-900 text-white px-5 py-3 text-md shadow-md hover:bg-purple-800 rounded transition duration-75"
            variant="default"
          >
            Login
          </Button>
        </Link>
      </nav>
    </header>
  );
};

export default Header;
