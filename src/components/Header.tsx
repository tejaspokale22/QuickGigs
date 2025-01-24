"use client";

import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Login from "./Login";
import Logo from "./Logo";
import Register from "./Register";

const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between p-[7px] bg-white shadow-lg w-full border border-b-1 border-gray-300">
      {/* Logo Section */}
      <div className="flex items-center ml-4">
        <Logo />
      </div>

      {/* Navigation Section */}
      <nav className="mr-4 flex items-center justify-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            {/* Login Button */}
            <Button
              className="bg-transparent text-black px-4 py-3 text-md shadow-md rounded hover:bg-gray-200"
              variant="outline"
            >
              Register
            </Button>
          </DialogTrigger>
          <Register />
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            {/* Login Button */}
            <Button
              className="bg-purple-900 text-white px-5 py-3 text-md shadow-md hover:bg-purple-800 rounded transition duration-75"
              variant="default"
            >
              Login
            </Button>
          </DialogTrigger>
          <Login />
        </Dialog>
      </nav>
    </header>
  );
};

export default Header;
