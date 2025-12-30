'use client'

import { useState, useMemo } from 'react'
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
} from '@/app/utils/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  Lock,
  Mail,
  ArrowLeft,
  LockKeyholeIcon,
  Eye,
  EyeOff,
  Loader2,
  ShieldCheck,
  ShieldAlert,
  Shield,
} from 'lucide-react'
import googleLogo from '../../public/google-icon.svg'
import logoImg from '../../public/logoImg.png'
import freelancerImg from '../../public/freelancer-woman.png'

interface SignUpFormInputs {
  email: string
  password: string
  confirmPassword: string
}

type PasswordStrength = 'weak' | 'medium' | 'strong'

const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return 'weak'
  let strength = 0
  if (password.length >= 8) strength++
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++
  if (/\d/.test(password)) strength++
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++
  if (strength <= 1) return 'weak'
  if (strength <= 3) return 'medium'
  return 'strong'
}

const getPasswordStrengthIcon = (strength: PasswordStrength) => {
  const icons = {
    weak: <ShieldAlert className="w-4 h-4 text-red-500" />,
    medium: <Shield className="w-4 h-4 text-yellow-500" />,
    strong: <ShieldCheck className="w-4 h-4 text-green-500" />,
  }
  return icons[strength]
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { toast } = useToast()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpFormInputs>()
  const router = useRouter()

  const password = watch('password', '')
  const passwordStrength = useMemo(
    () => calculatePasswordStrength(password),
    [password],
  )

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user

      if (!user.emailVerified) {
        toast({
          variant: 'destructive',
          title: 'Email Not Verified',
          description: 'Please verify your email to proceed.',
        })
        setLoading(false)
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

      toast({
        title: 'Success!',
        description: 'You have successfully signed up with Google.',
      })

      router.push('/')
    } catch (error: any) {
      console.error('Google login error:', error)
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description:
          error.message || 'Failed to log in with Google. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setLoading(true)
    const { email, password, confirmPassword } = data

    if (password !== confirmPassword) {
      toast({
        variant: 'destructive',
        title: 'Password Mismatch',
        description: 'Passwords do not match. Please check and try again.',
      })
      setLoading(false)
      return
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      )
      const user = userCredential.user

      if (user) {
        await sendEmailVerification(user)
        toast({
          title: 'Verification Email Sent!',
          description: 'Please check your inbox and verify your email.',
        })
        localStorage.setItem('isAuthenticated', JSON.stringify(true))
        router.push('/')
      }
    } catch (error: any) {
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'This email is already registered. Please login instead.'
          : error.message || 'Failed to register. Please try again.'

      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: errorMessage,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-full lg:w-[45%] bg-white grid grid-rows-[auto_1fr]">
        {/* Content */}
        <div className="flex items-center justify-center px-6 lg:px-8 py-28">
          <div className="w-full max-w-sm">
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
              disabled={loading}
              className="w-full h-11 rounded-full flex items-center justify-center gap-3
                     bg-white text-gray-700 border border-gray-300
                     hover:bg-gray-50 transition disabled:opacity-50"
            >
              {loading ? (
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
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                  disabled={loading}
                  className="h-10 rounded-full bg-gray-50 border-gray-200
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
                    disabled={loading}
                    className="h-10 pr-11 rounded-full bg-gray-50 border-gray-200
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
                    disabled={loading}
                    className="h-10 pr-11 rounded-full bg-gray-50 border-gray-200
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
                disabled={loading}
                className="w-full h-11 rounded-full bg-black text-white
                       hover:bg-gray-900 transition
                       flex items-center justify-center gap-2 text-sm font-semibold"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account...
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
            <h2 className="text-4xl font-bold leading-snug tracking-tight">
              Start your freelancing journey
            </h2>
            <p className="text-lg leading-relaxed text-gray-200">
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
