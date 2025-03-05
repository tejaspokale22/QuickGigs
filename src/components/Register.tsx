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
import { LockKeyholeIcon } from "lucide-react";

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
    <div className="flex h-screen w-screen">
      <div className="w-1/2">
        <Image src={loginBg} alt="Register Background" className="h-screen w-full" />
      </div>

      <div className="w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-3/4 p-8 bg-white rounded border border-gray-400">
          <h2 className="text-2xl font-bold text-center mb-10 text-black">
            Create a new account
          </h2>

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
              {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
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
              {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Confirm Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                })}
                className="w-full p-3 border border-gray-400 rounded focus:border-2 focus:border-black"
              />
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <Button type="submit" className="w-full bg-black text-white py-3 rounded hover:bg-gray-800">
              {loading ? "Registering..." : <><LockKeyholeIcon /> Register</>}
            </Button>
          </form>

          <div className="block text-center font-bold my-4">Or</div>

          <div className="flex justify-center">
            <Button onClick={handleGoogleLogin} className="w-full text-black py-3 rounded flex items-center justify-center bg-white shadow-md border border-gray-400 hover:bg-gray-200">
              <Image src={googleLogo} alt="Google Logo" width={20} height={20} className="mr-2" />
              Sign up with Google
            </Button>
          </div>

          <p className="text-center mt-4">
            Already have an account?
            <Link href="/login" className="text-black hover:underline font-bold ml-1">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;