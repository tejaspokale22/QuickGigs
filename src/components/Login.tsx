"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "@/app/utils/firebase";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import Image from "next/image";
import googleLogo from "../../public/google-icon.svg";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@radix-ui/react-dialog";
import Register from "./Register";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setFocus,
  } = useForm<LoginFormInputs>();
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log("Google user:", user);
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to log in with Google. Please try again.");
    }
  };

  // Login form submit handler
  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    const { email, password } = data;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in as:", email);
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <DialogContent className="w-full max-w-md bg-white rounded-md shadow-lg p-6">
      <DialogTitle>
        <h2 className="text-2xl font-bold text-center flex gap-2 items-center justify-center">
          Login to
          <Logo />
        </h2>
      </DialogTitle>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        {/* Email Field */}
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Please enter a valid email address",
              },
            })}
            className="w-full p-3 border border-gray-300 rounded-md focus:border-2 focus:border-black"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters long",
              },
            })}
            onFocus={() => setFocus("password")} // Focus to password on input
            className="w-full p-3 border border-gray-300 rounded-md focus:border-2 focus:border-black"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800"
        >
          Login
        </Button>
      </form>
      <span className="text-center">Or</span>
      {/* Google Login Button */}
      <div className="flex justify-center space-x-2">
        <Button
          onClick={handleGoogleLogin}
          className="w-full text-black py-3 rounded-md flex items-center justify-center bg-white shadow-md border-gray-200 border-2"
        >
          <Image
            src={googleLogo}
            alt="Google Logo"
            width={20}
            height={20}
            className="mr-2"
          />
          Login with Google
        </Button>
      </div>
    </DialogContent>
  );
};

export default Login;
