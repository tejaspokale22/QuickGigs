'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
} from '@/utils/firebase'
import Image from 'next/image'
import googleLogo from '../../public/google-icon.svg'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import loginBg from '../../public/loginbg.jpg'
import logoImg from '../../public/logoImg.png'
import {
  Lock,
  LockKeyholeIcon,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
} from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'

interface LoginFormInputs {
  email: string
  password: string
}

const Login: React.FC = () => {
  const [emailLoading, setEmailLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const router = useRouter()

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user

      // 🔐 Optional but recommended
      if (!user.emailVerified) {
        await signOut(auth)
        toast.error('Please verify your email before logging in.')
        return
      }

      toast.success('Logged in successfully')
      router.replace('/')
    } catch (error) {
      console.error('Google login error:', error)
      toast.error('Failed to log in with Google. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setEmailLoading(true)

    const { email, password } = data

    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user

      if (!user.emailVerified) {
        await signOut(auth)
        toast.error('Please verify your email before logging in.')
        return
      }

      toast.success('Logged in successfully')
      router.replace('/')
    } catch (error) {
      console.error('Authentication error:', error)
      toast.error('Invalid email or password.')
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-[45%] bg-white grid grid-rows-[auto_1fr]">
        {/* Content */}
        <div className="flex items-center justify-center px-6 lg:px-8 py-28">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mb-3 flex justify-center">
                <Image
                  src={logoImg}
                  width={44}
                  height={44}
                  alt="QuickGigs"
                  priority
                />
              </div>

              <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>

              <p className="mt-1 text-sm text-gray-600">
                Login to continue to QuickGigs
              </p>
            </div>

            {/* Google login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-11 rounded-lg flex items-center justify-center gap-3
                   bg-gray-50 text-gray-700
                   hover:bg-gray-100 disabled:opacity-50 cursor-pointer
                   border border-gray-100"
            >
              {googleLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Image src={googleLogo} alt="Google" width={18} height={18} />
                  <span className="text-sm font-medium">
                    Continue with Google
                  </span>
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase tracking-wide">
                <span className="px-3 bg-white text-gray-500">
                  Or login with email
                </span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-10 rounded-full bg-gray-50 border-gray-100
                         focus:bg-white focus:border-black focus:ring-0"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    className="h-10 rounded-full bg-gray-50 border-gray-100
                         focus:bg-white focus:border-black focus:ring-0"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                  />

                  {errors.password && (
                    <p className="text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm text-black hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={emailLoading}
                className="w-full h-11 rounded-lg bg-black text-white
                     hover:bg-gray-700 transition
                     flex items-center justify-center gap-2
                     text-sm font-semibold cursor-pointer"
              >
                {emailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <LockKeyholeIcon className="w-4 h-4" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <p className="mt-5 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-black hover:underline"
              >
                Sign up
              </Link>
            </p>
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
  )
}

export default Login
