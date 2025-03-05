"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "@/app/utils/firebase";
import Image from "next/image";
import googleLogo from "../../public/google-icon.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";
import loginBg from "../../public/loginbg.jpg";
import { Lock, LockKeyholeIcon, Mail } from "lucide-react";

interface LoginFormInputs {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();
  const router = useRouter();

  // Google login handler
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      console.log("Google user:", user);
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("uid", user.uid);
      router.push("/");
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
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      router.push("/");
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="flex h-screen w-screen">
      {/* Left Side - Background Image */}
      <div className="w-1/2">
        <Image
          src={loginBg}
          alt="Login Background"
          // layout="fill"
          // objectFit="contain"
          className="h-screen w-full"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-3/4 p-8 bg-white rounded border border-gray-400">
          <h2 className="text-2xl font-bold text-center mb-10 flex items-center justify-center gap-2 text-black">
            Login to your acccount
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                className="w-full p-4 border border-gray-400 rounded focus:border-2 focus:border-black"
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
                className="w-full p-3 border border-gray-400 rounded focus:border-2 focus:border-black"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
              <LockKeyholeIcon/>
              Login
            </Button>
          </form>

          <span className="block text-center font-bold my-4">Or</span>

          {/* Google Login Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleGoogleLogin}
              className="w-full text-black py-3 rounded-md flex items-center justify-center bg-white shadow-md border border-gray-400 hover:bg-gray-200"
            >
              <Image src={googleLogo} alt="Google Logo" width={20} height={20} className="mr-2" />
              Login with Google
            </Button>
          </div>

          <p className="text-center mt-4">
            Don&apos;t have an account? 
            <Link href="/register" className="text-black hover:underline font-bold ml-1">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
