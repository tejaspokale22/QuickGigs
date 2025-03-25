'use client'

import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

// Firebase imports
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  firestore,
} from '@/app/utils/firebase'
import { doc, setDoc, getDoc } from 'firebase/firestore'

// Component imports
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// Icon imports
import {
  Lock,
  Mail,
  ArrowLeft,
  CheckCircle2,
  LockKeyholeIcon,
} from 'lucide-react'

// Asset imports
import googleLogo from '../../public/google-icon.svg'
import logoImg from '../../public/logoImg.png'
import freelancerImg from '../../public/freelancer-woman.avif'

// Types
interface SignUpFormInputs {
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormInputs>()
  const router = useRouter()

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider())
      const user = result.user

      if (!user.emailVerified) {
        alert('Please verify your email to proceed.')
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
    } catch (error) {
      console.error('Google login error:', error)
      alert('Failed to log in with Google. Please try again.')
    }
  }

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    setLoading(true)
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      alert('Passwords do not match!')
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
        alert('Verification email sent! Please check your inbox.')
        localStorage.setItem('isAuthenticated', JSON.stringify(true))
        router.push('/')
      }
    } catch (error: any) {
      alert(error.message || 'Failed to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Side - Registration Form */}
      <div className="w-full lg:w-[45%] h-full flex flex-col p-6 lg:p-8 bg-white relative">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Header */}
          <header className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-3">
              <span>Join</span>
              <div className="flex items-center justify-center gap-1">
                <Image
                  src={logoImg}
                  width={30}
                  height={38}
                  alt="logo"
                  priority
                />
                <span>QuickGigs</span>
              </div>
            </h1>
            <p className="text-gray-500 mt-2">
              Find opportunities that match your skills
            </p>
          </header>

          {/* Google Sign Up Button */}
          <Button
            onClick={handleGoogleLogin}
            className="w-full py-5 mb-6 rounded flex items-center justify-center gap-3 bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Image src={googleLogo} alt="Google Logo" width={20} height={20} />
            Continue with Google
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                or register with email
              </span>
            </div>
          </div>

          {/* Email Registration Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message: 'Please enter a valid email',
                    },
                  })}
                  className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black rounded"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Create password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Min. 6 characters',
                    },
                  })}
                  className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black rounded"
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="password"
                  placeholder="Confirm password"
                  {...register('confirmPassword', {
                    required: 'Please confirm password',
                    minLength: {
                      value: 6,
                      message: 'Min. 6 characters',
                    },
                  })}
                  className="pl-10 py-5 bg-gray-50 border-gray-200 focus:bg-white focus:border-black rounded"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-black text-white py-5 rounded hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                'Creating account...'
              ) : (
                <>
                  <LockKeyholeIcon className="w-5 h-5" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <p className="text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-black font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Illustration */}
      <div className="hidden lg:block w-[55%] relative overflow-hidden">
        <Image
          src={freelancerImg}
          alt="Professional freelancer working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-transparent">
          {/* Subtle Grid Overlay for Texture */}
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <svg
              className="w-full h-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <pattern
                  id="grid"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 10 0 L 0 0 0 10"
                    fill="none"
                    stroke="white"
                    strokeWidth="0.3"
                    opacity="0.1"
                  />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>

          {/* Content Block - Positioned Top Left */}
          <div className="absolute top-0 left-0 p-12 max-w-xl">
            {/* Main Content */}
            <div className="space-y-8">
              {/* Heading Section */}
              <div>
                <h2 className="text-4xl font-bold text-white mb-3">
                  Start small, Dream big
                </h2>
                <p className="text-gray-200 text-lg leading-relaxed max-w-md">
                  Your gateway to freelancing—tailored for college students
                  looking to gain experience, enhance skills, and earn while
                  learning.
                </p>
              </div>

              {/* Key Value Proposition */}
              <div className="rounded p-6 max-w-sm">
                <div className="space-y-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-white">
                        No Experience? No Problem!
                      </span>
                      <p className="text-gray-300 text-sm">
                        Get started with beginner-friendly tasks designed to
                        help you build your portfolio and confidence.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-white">
                        Learn & Earn
                      </span>
                      <p className="text-gray-300 text-sm">
                        Gain hands-on experience by working on real projects and
                        start making money from your skills.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                    <div>
                      <span className="font-semibold text-white">
                        Work on Your Schedule
                      </span>
                      <p className="text-gray-300 text-sm">
                        Flexible, short-term gigs designed around your college
                        life—no long-term commitments.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
