"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { auth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, sendEmailVerification, firestore } from "@/app/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Image from "next/image";
import googleLogo from "../../public/google-icon.svg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import loginBg from "../../public/loginbg.jpg";
import { 
  Lock, 
  Mail, 
  ArrowLeft,
  CheckCircle2,
  User,
  LockKeyholeIcon 
} from "lucide-react";

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
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      
      if (!user.emailVerified) {
        alert("Please verify your email to proceed.");
        return;
      }
      
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
          createdAt: new Date().toISOString(),
        });
      }
      
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      localStorage.setItem("uid", user.uid);
      router.push("/");
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        await sendEmailVerification(user);
        alert("Verification email sent! Please check your inbox.");
        localStorage.setItem("isAuthenticated", JSON.stringify(true));
        router.push("/");
      }
    } catch (error: any) {
      alert(error.message || "Failed to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Registration Form */}
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
            <div className="text-center mb-8">
              <div className="flex flex-col items-center gap-4 mb-6">
              </div>
              <p className="text-3xl font-bold text-gray-900">Create your account</p>
              <p className="text-gray-500 mt-2">Join our community and start your journey with us</p>
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
                    className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:border-2 focus:ring-black"
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
                    placeholder="Create a password"
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

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    type="password"
                    placeholder="Confirm your password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      minLength: {
                        value: 6,
                        message: "Password must be at least 6 characters long",
                      },
                    })}
                    className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black focus:border-2"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full bg-black text-white py-6 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading ? (
                  "Creating your account..."
                ) : (
                  <>
                    <LockKeyholeIcon className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              onClick={handleGoogleLogin}
              className="w-full py-6 rounded-lg flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
              Sign up with Google
            </Button>

            <p className="text-center text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-black font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="hidden lg:flex items-center justify-center gap-8 pt-8 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Secure Registration</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Join 5000+ Students</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-600">Free Forever</span>
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

export default Register;