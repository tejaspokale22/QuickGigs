"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "@/app/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import googleLogo from "../../public/google-icon.svg";
import Logo from "./Logo";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const router = useRouter(); // Hook to handle routing

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;

      if (!user.emailVerified) {
        alert("Please verify your email to proceed.");
        return;
      }

      // Set isAuthenticated to true in localStorage
      localStorage.setItem("isAuthenticated", JSON.stringify(true));

      router.push("/"); // Redirect after successful login
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to log in with Google. Please try again.");
    }
  };

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setLoading(true);
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        alert("Verification email sent! Please check your inbox.");

        // Set isAuthenticated to true in localStorage after successful registration
        localStorage.setItem("isAuthenticated", JSON.stringify(true));

        // Redirect to home page after registration
        router.push("/"); // Push user to home page
      }
    } catch (error: any) {
      alert(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-md shadow-lg p-8 border border-gray-400">
      <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
        Register to <Logo />
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Enter a valid email",
              },
            })}
            className="w-full p-3 border border-gray-400 rounded-md focus:border-2 focus:border-black"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
          )}
        </div>

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
            className="w-full p-3 border border-gray-400 rounded-md focus:border-2 focus:border-black"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword", {
              required: "Confirm Password is required",
            })}
            className="w-full p-3 border border-gray-400 rounded-md focus:border-2 focus:border-black"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-900 text-white hover:bg-purple-800"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          ) : (
            "Sign Up"
          )}
        </Button>
      </form>

      <span className="block text-center font-bold mt-4">Or</span>

      <Button
        onClick={handleGoogleLogin}
        className="w-full text-black py-3 rounded-md flex items-center justify-center bg-white border border-gray-400 shadow-md hover:bg-gray-200 mt-4"
      >
        <Image
          src={googleLogo}
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2"
        />
        Sign Up with Google
      </Button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-purple-900 font-bold hover:underline"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default Register;
