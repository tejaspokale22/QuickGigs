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
import loginBg from "../../public/loginbg.jpg";
import { 
  Lock, 
  LockKeyholeIcon, 
  Mail, 
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

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

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("uid", user.uid);
      router.push("/");
    } catch (error) {
      console.error("Google login error:", error);
      alert("Failed to log in with Google. Please try again.");
    }
  };

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
    <div className="flex min-h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-12 bg-white relative">
        {/* Back to Home Button */}
        <Link 
          href="/" 
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full rounded mt-4">
          <div className="w-full space-y-6">
            <div className="text-center mb-12">
              <p className="text-3xl font-bold text-gray-900">Login to your account</p>
            </div>

            <Button
              onClick={handleGoogleLogin}
              className="w-full py-6 rounded flex items-center justify-center gap-3 bg-gray-50 text-gray-700 hover:bg-gray-100"
            >
              <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
              Sign in with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: "Please enter a valid email address",
                      },
                    })}
                    className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:border-2"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:border-2"
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-sm text-black hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white py-6 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                <LockKeyholeIcon className="w-5 h-5" />
                Sign In
              </Button>
            </form>

            <p className="text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-black font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="hidden lg:flex items-center justify-center gap-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="text-sm text-gray-600">Secure Login</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="text-sm text-gray-600">Trusted by 5000+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-black" />
            <span className="text-sm text-gray-600">24/7 Support</span>
          </div>
        </div>
      </div>

      {/* Right Side - Background Image */}
      <div className="hidden lg:block w-1/2 relative">
        <Image
          src={loginBg}
          alt="Students working"
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
};

export default Login;
