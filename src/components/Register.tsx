'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  firestore,
  signOut,
} from '@/utils/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, Mail, LockKeyholeIcon, Eye, EyeOff, Loader2 } from 'lucide-react'
import googleLogo from '../../public/google-icon.svg'
import logoImg from '../../public/logoImg.png'
import freelancerImg from '../../public/freelancer-woman.png'
import toast from 'react-hot-toast'

interface SignUpFormInputs {
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const [emailLoading, setEmailLoading] = useState<boolean>(false)
  const [googleLoading, setGoogleLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user

      if (!user.emailVerified) {
        toast.error('Please verify your email before logging in.')
        setGoogleLoading(false)
        return
      }

      const userRef = doc(firestore, 'users', user.uid)
      const userDoc = await getDoc(userRef)

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePicture: user.photoURL,
        })
      }

      localStorage.setItem('isAuthenticated', JSON.stringify(true))
      localStorage.setItem('uid', user.uid)

      router.push('/')
    } catch (error: any) {
      console.error('Google login error:', error)
      toast.error('Google login failed. Please try again.')
    } finally {
      setGoogleLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setEmailLoading(true)
    const { email, password, confirmPassword } = data

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please check and try again.')
      setEmailLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )

      const user = userCredential.user

      // ✅ Send verification email
      await sendEmailVerification(user)

      // ✅ IMPORTANT: Sign out immediately
      await signOut(auth)

      toast.success(
        'Verification email sent. Please verify your email before logging in.',
      )

      // ❌ DO NOT set auth flags
      // ❌ DO NOT redirect to home/dashboard
      router.push('/login')
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please login instead.'
          : error.message || 'Failed to register. Please try again.'

      toast.error(errorMessage)
    } finally {
      setEmailLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT PANEL */}
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

              <h1 className="text-2xl font-bold text-gray-900">
                Join QuickGigs
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Find opportunities that match your skills
              </p>
            </div>

            {/* Google login */}
            <Button
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full h-11 rounded-lg flex items-center justify-center gap-3
                     bg-gray-50 text-gray-700
                     hover:bg-gray-100 disabled:opacity-50 cursor-pointer border border-gray-100"
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
                  Or register with email
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
                  {...register('email')}
                  disabled={emailLoading}
                  className="h-10 rounded-full bg-gray-50 border-gray-100
                         focus:bg-white focus:border-black focus:ring-0"
                />
              </div>
              {/* Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password')}
                    disabled={emailLoading}
                    className="h-10 pr-11 rounded-full bg-gray-50 border-gray-100
                           focus:bg-white focus:border-black focus:ring-0"
                  />
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

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword')}
                    disabled={emailLoading}
                    className="h-10 pr-11 rounded-full bg-gray-50 border-gray-100
                           focus:bg-white focus:border-black focus:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={emailLoading}
                className="w-full h-11 rounded-lg bg-black text-white
                       hover:bg-gray-700 transition
                       flex items-center justify-center gap-2 text-sm font-semibold mt-4 cursor-pointer"
              >
                {emailLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </>
                ) : (
                  <>
                    <LockKeyholeIcon className="w-4 h-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <p className="mt-5 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-semibold text-black hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT IMAGE PANEL (unchanged) */}
      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <Image
          src={freelancerImg}
          alt="Professional freelancer"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/75 via-black/60 to-black/35" />
        <div className="absolute inset-0 flex items-start">
          <div className="pt-24 pl-12 max-w-xl space-y-5 text-white">
            <h2 className="text-4xl font-normal leading-snug tracking-tight">
              Begin your freelancing journey
            </h2>
            <p className="text-xl leading-relaxed text-gray-200">
              Join thousands of talented freelancers finding meaningful work on
              QuickGigs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
