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
  CheckCircle2,
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
import freelancerImg from '../../public/freelancer-woman.avif'

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
      <div className="w-full lg:w-[45%] h-full flex flex-col p-6 lg:p-8 mt-20 bg-white">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="font-medium">Back to Home</span>
        </Link>

        <div className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col justify-center max-w-md mx-auto w-full">
            <header className="text-center mb-8">
              <div className="mb-4 flex justify-center">
                <Image
                  src={logoImg}
                  width={50}
                  height={50}
                  alt="QuickGigs"
                  priority
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Join QuickGigs
              </h1>
              <p className="text-gray-600 text-sm">
                Find opportunities that match your skills
              </p>
            </header>

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-6 mb-6 rounded-full flex items-center justify-center gap-3 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 hover:border-gray-400 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Image src={googleLogo} alt="Google" width={20} height={20} />
                  <span className="font-medium">Continue with Google</span>
                </>
              )}
            </Button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  or register with email
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value:
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="px-4 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-0 rounded-full transition-colors"
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="px-4 pr-12 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-0 rounded-full transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getPasswordStrengthIcon(passwordStrength)}
                      <span className="text-xs font-medium text-gray-600 capitalize">
                        {passwordStrength} password
                      </span>
                    </div>
                    <div className="flex gap-1 h-1">
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          passwordStrength === 'weak'
                            ? 'bg-red-500'
                            : passwordStrength === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                      ></div>
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          passwordStrength === 'medium'
                            ? 'bg-yellow-500'
                            : passwordStrength === 'strong'
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                      <div
                        className={`flex-1 rounded-full transition-all ${
                          passwordStrength === 'strong'
                            ? 'bg-green-500'
                            : 'bg-gray-200'
                        }`}
                      ></div>
                    </div>
                  </div>
                )}

                {errors.password && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    {...register('confirmPassword', {
                      required: 'Please confirm your password',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters',
                      },
                    })}
                    className="px-4 pr-12 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-gray-900 focus:ring-0 rounded-full transition-colors"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-black text-white py-6 rounded-full hover:bg-gray-900 transition-colors flex items-center justify-center gap-2 font-semibold disabled:opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    <LockKeyholeIcon className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-gray-600 text-sm mb-6">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-black font-semibold hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[55%] relative overflow-hidden">
        <Image
          src={freelancerImg}
          alt="Professional freelancer"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20">
          <div className="absolute top-24 left-12 max-w-lg space-y-4 text-white">
            <h2 className="text-4xl font-bold leading-tight">
              Start your freelancing journey
            </h2>
            <p className="text-lg text-gray-200">
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
