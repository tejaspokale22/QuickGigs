'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Medal,
  Star,
  Send,
} from 'lucide-react'
import hero from '../../public/hero.jpg'
// import heroine from '../../public/heroine.jpg';

export default function Home() {
  const features = [
    {
      title: 'Student-Friendly Gigs',
      description:
        'Find flexible projects that fit perfectly around your class schedule. From content writing to web development, discover opportunities that complement your studies.',
      icon: (
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 14L8 10H16L12 14Z" fill="currentColor" />
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: 'Build Your Portfolio',
      description:
        'Start your professional journey while still in college. Each project adds to your portfolio, giving you real-world experience that employers value.',
      icon: (
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 12V22H4V12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M22 7H2V12H22V7Z" stroke="currentColor" strokeWidth="2" />
          <path
            d="M12 22V7"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 7H16.5C17.8807 7 19 5.88071 19 4.5C19 3.11929 17.8807 2 16.5 2C15.1193 2 14 3.11929 14 4.5V5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M12 7H7.5C6.11929 7 5 5.88071 5 4.5C5 3.11929 6.11929 2 7.5 2C8.88071 2 10 3.11929 10 4.5V5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      title: 'Quick & Secure Payments',
      description:
        'Focus on your studies without payment worries. Get paid promptly through our secure payment system, perfect for managing your student expenses.',
      icon: (
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
          <path
            d="M7 15H7.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M11 15H13"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ]

  const testimonials = [
    {
      quote:
        'QuickGigs helped me earn while maintaining my academic focus. The flexible projects perfectly fit my schedule.',
      author: 'Sarah Chen',
      role: 'Computer Science Junior',
      university: 'Stanford University',
    },
    {
      quote:
        "I've built an impressive portfolio through QuickGigs projects. It gave me an edge in my internship applications.",
      author: 'James Wilson',
      role: 'Design Student',
      university: 'NYU',
    },
  ]

  const categories = [
    {
      title: 'Web Development',
      description: 'Frontend, Backend, Full-Stack projects',
      count: '2.5k+ jobs',
      icon: '🌐',
    },
    {
      title: 'Content Writing',
      description: 'Blogs, Articles, Academic Writing',
      count: '1.8k+ jobs',
      icon: '✍️',
    },
    {
      title: 'Design',
      description: 'UI/UX, Graphic Design, Illustrations',
      count: '1.2k+ jobs',
      icon: '🎨',
    },
    {
      title: 'Digital Marketing',
      description: 'Social Media, SEO, Content Marketing',
      count: '900+ jobs',
      icon: '📱',
    },
  ]

  const benefits = [
    'Flexible work hours that fit your class schedule',
    'Real projects from actual companies',
    'Build a professional portfolio while studying',
    'Earn competitive rates for your skills',
    'Network with industry professionals',
    'Gain practical experience in your field',
    'Access to mentorship and guidance',
    'Choose projects that match your interests',
  ]

  const leaderboard = [
    {
      rank: 1,
      name: 'Priya Sharma',
      university: 'IIT Delhi',
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      gigsCompleted: 48,
      earnings: '₹1,20,000',
      rating: 4.9,
      badge: 'Elite',
    },
    {
      rank: 2,
      name: 'Rahul Patel',
      university: 'BITS Pilani',
      avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
      gigsCompleted: 42,
      earnings: '₹95,000',
      rating: 4.8,
      badge: 'Pro',
    },
    {
      rank: 3,
      name: 'Aisha Khan',
      university: 'VIT Vellore',
      avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
      gigsCompleted: 39,
      earnings: '₹88,000',
      rating: 4.9,
      badge: 'Pro',
    },
    {
      rank: 4,
      name: 'Dev Kapoor',
      university: 'IIIT Hyderabad',
      avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
      gigsCompleted: 35,
      earnings: '₹82,000',
      rating: 4.7,
      badge: 'Rising Star',
    },
    {
      rank: 5,
      name: 'Neha Gupta',
      university: 'NIT Trichy',
      avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
      gigsCompleted: 32,
      earnings: '₹75,000',
      rating: 4.8,
      badge: 'Rising Star',
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-[96px] px-6 max-w-[1400px] mx-auto relative bg-white rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              Start Monetizing <br />
              <span className="text-black">while still in College</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              QuickGigs connects ambitious college students with flexible
              freelance opportunities. Build your portfolio, earn money, and
              gain real-world experience without compromising your studies.
            </p>
            <div className="flex gap-4">
              <button className="bg-black text-white px-8 py-1 rounded text-lg font-medium hover:bg-gray-900 transition-all flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-black px-6 py-1 rounded text-lg font-medium hover:bg-gray-200 transition-all flex gap-3 items-center justify-center">
                <span>
                  <Send />
                </span>
                Post a Project
              </button>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex -space-x-2">
                {[
                  'https://randomuser.me/api/portraits/men/32.jpg',
                  'https://randomuser.me/api/portraits/women/44.jpg',
                  'https://randomuser.me/api/portraits/men/76.jpg',
                  'https://randomuser.me/api/portraits/women/68.jpg',
                ].map((imageUrl, i) => (
                  <img
                    key={i}
                    src={imageUrl}
                    alt={`User ${i + 1}`}
                    className="w-8 h-8 rounded-full border-2 border-white object-cover transition-all duration-200 hover:z-10 hover:scale-110 hover:shadow-md hover:border-blue-300 cursor-pointer"
                  />
                ))}
              </div>
              <p>
                Join <span className="font-semibold text-black">5,000+</span>{' '}
                students already earning
              </p>
            </div>
          </div>
          <div className="relative h-[600px] hidden lg:block">
            <div className="absolute inset-0 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              <Image
                src={hero}
                alt="Students collaborating"
                fill
                className="object-cover opacity-100"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-32 px-6">
        <div className="max-w-7xl mx-auto border-y border-gray-100 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              '5000+ Student Freelancers',
              '10k+ Projects',
              '500+ Universities',
              '₹2M+ Paid',
            ].map((stat, index) => (
              <div className="text-center" key={index}>
                <div className="text-4xl font-bold text-black">
                  {stat.split(' ')[0]}
                </div>
                <div className="text-gray-600 mt-2">{stat.split(' ')[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">
          Popular Categories
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Explore diverse opportunities across various fields. Find projects
          that match your skills and interests.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all"
              key={index}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-bold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <p className="text-sm font-medium text-gray-500">
                {category.count}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-12 border border-gray-100 shadow-sm">
          <h2 className="text-3xl font-bold mb-6">
            Why Students Choose QuickGigs
          </h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            We understand the unique challenges of balancing academics with
            professional growth. That's why we've designed our platform
            specifically for college students.
          </p>
          <div className="grid gap-6">
            {benefits.map((benefit, index) => (
              <div className="flex items-center gap-4" key={index}>
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Designed for Student Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md group hover:bg-black hover:text-white transition-all duration-300"
              key={index}
            >
              <div className="text-gray-900 group-hover:text-white mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600 group-hover:text-gray-300 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          From Our Student Community
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
              key={index}
            >
              <p className="text-lg text-gray-600 mb-6">
                "{testimonial.quote}"
              </p>
              <div>
                <div className="font-bold text-black">{testimonial.author}</div>
                <div className="text-gray-500 text-sm">{testimonial.role}</div>
                <div className="text-gray-500 text-sm">
                  {testimonial.university}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-black to-gray-900 rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">
              Start Your Freelance Journey Today
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of college students who are building their careers,
              earning money, and gaining valuable experience through QuickGigs.
            </p>
            <button className="bg-white text-black px-8 py-4 rounded text-lg font-medium hover:bg-gray-100 transition-all">
              Start Earning Now
            </button>
          </div>

          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: '30px 30px',
              }}
            ></div>
          </div>
        </div>
      </section>

      {/* New Leaderboard Section */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-6">Student Achievers</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our top performing students who are excelling in their
            freelance journey while pursuing their studies.
          </p>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Student
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    University
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Gigs Completed
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Earnings
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Rating
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Badge
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboard.map((student) => (
                  <tr
                    key={student.rank}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {student.rank === 1 ? (
                          <Trophy className="w-5 h-5 text-yellow-400" />
                        ) : student.rank === 2 ? (
                          <Medal className="w-5 h-5 text-gray-400" />
                        ) : student.rank === 3 ? (
                          <Medal className="w-5 h-5 text-amber-600" />
                        ) : (
                          <span className="text-gray-500">{student.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {student.university}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {student.gigsCompleted}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {student.earnings}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{student.rating}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${
                          student.badge === 'Elite'
                            ? 'bg-purple-100 text-purple-700'
                            : student.badge === 'Pro'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {student.badge}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievement Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <div className="bg-white p-6 rounded-xl border border-purple-200 shadow-sm hover:shadow-md transition-all">
            <Trophy className="w-8 h-8 text-purple-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Elite Badge</h3>
            <p className="text-gray-600">
              Complete 40+ gigs with an average rating above 4.8 to earn the
              prestigious Elite badge.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all">
            <Medal className="w-8 h-8 text-blue-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Pro Badge</h3>
            <p className="text-gray-600">
              Complete 30+ gigs with an average rating above 4.5 to earn the Pro
              badge.
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-all">
            <Star className="w-8 h-8 text-green-600 mb-4" />
            <h3 className="font-bold text-xl mb-2">Rising Star</h3>
            <p className="text-gray-600">
              Complete 20+ gigs with an average rating above 4.0 to earn the
              Rising Star badge.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div>
              <h3 className="text-xl font-bold mb-4">QuickGigs</h3>
              <p className="text-gray-400 mb-6">
                Empowering college students to kickstart their careers through
                meaningful freelance opportunities.
              </p>
              <div className="flex gap-4">
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Instagram className="w-5 h-5" />
                </Link>
                <Link
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Students</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Browse Projects
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Student Resources
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Learning Center
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">For Clients</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Post a Project
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Find Talent
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Enterprise Solutions
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Client Reviews
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Trust & Safety
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-20 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>© 2025 QuickGigs. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
