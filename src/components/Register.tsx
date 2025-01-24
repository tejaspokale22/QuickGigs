"use client";

import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  // sendEmailVerification,
} from "@/app/utils/firebase";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import googleLogo from "../../public/google-icon.svg";
import Logo from "./Logo";

interface SignUpFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>();
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log("Google user:", user);
      router.push("/dashboard");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to log in with Google. Please try again.");
    }
  };

  // Form submit handler
  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    const { email, password, confirmPassword } = data;
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User registered:", user);

      // Send email verification
      if (user) {
        // await sendEmailVerification(user);
        alert("Verification email sent! Please check your inbox.");
      }

      router.push("/dashboard");
    } catch (error: any) {
      console.error("Registration error:", error);
      alert(error.message || "Failed to register. Please try again.");
    }
  };

  return (
    <DialogContent className="w-full max-w-md bg-white rounded-md shadow-lg p-6">
      <DialogTitle>
        <h2 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          Register to <Logo />
        </h2>
      </DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
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
            className="w-full p-3 border border-gray-300 rounded-md focus:border-2 focus:border-black"
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
            className="w-full p-3 border border-gray-300 rounded-md focus:border-2 focus:border-black"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-purple-900 text-white py-3 rounded-md hover:bg-purple-800"
        >
          Sign Up
        </Button>
      </form>

      <span className="block text-center font-bold">Or</span>

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
          Sign Up with Google
        </Button>
      </div>
    </DialogContent>
  );
};

export default Register;
