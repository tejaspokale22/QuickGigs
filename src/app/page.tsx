'use client'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
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
  ChevronDown,
} from 'lucide-react'
import { useState } from 'react'
import hero from '../../public/hero.jpg'
import {
  features,
  testimonials,
  categories,
  faqs,
  benefits,
  leaderboard,
  stats,
} from '@/lib/constants'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="pt-24 px-6 max-w-350 mx-auto relative bg-white rounded-2xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black leading-tight">
              Start Monetizing <br />
              <span className="text-black">While Still in College</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-xl">
              QuickGigs connects ambitious students with flexible freelance
              opportunities. Build your portfolio, earn money, and gain
              real-world experience without compromising your studies.
            </p>
            <div className="flex gap-4">
              <Link href="/register">
                <button className="bg-black text-white px-8 py-2 rounded-md text-lg font-medium hover:bg-gray-700 transition-all flex items-center gap-2 group cursor-pointer">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/gigs">
                <button className="border-2 border-black px-6 py-2 rounded-md text-md font-medium hover:bg-gray-100 transition-all flex gap-3 items-center justify-center cursor-pointer">
                  <Send className="w-5 h-5" />
                  Browse Gigs
                </button>
              </Link>
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
                    className="w-8 h-8 rounded-full border-2 border-white object-cover transition-all duration-200 hover:z-10 hover:scale-110 hover:shadow-md hover:border-gray-300 cursor-pointer"
                  />
                ))}
              </div>
              <p>
                Join <span className="font-semibold text-black">5,000+</span>{' '}
                students already earning
              </p>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-150 hidden lg:block"
          >
            <div className="absolute inset-0 bg-linear-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden">
              <Image
                src={hero}
                alt="Students collaborating"
                fill
                className="object-cover opacity-100"
                priority
              />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-32 px-6"
      >
        <div className="max-w-7xl mx-auto border-y border-gray-100 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-black">
                  {stat.value}
                </div>
                <div className="text-gray-600 mt-2">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Browse Gig Categories */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-4">Browse Gig Categories</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore opportunities across diverse fields and find projects that
            match your skills.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => {
            const IconComponent = category.icon
            return (
              <Link key={index} href="/gigs">
                <div className="group bg-white border-2 border-gray-200 rounded-2xl p-8 cursor-pointer transition-all duration-300 hover:border-black hover:shadow-xl">
                  <div className="bg-gray-100 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:bg-black transition-colors duration-300">
                    <IconComponent className="w-8 h-8 text-black group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">
                    {category.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-medium">
                    {category.proposals} proposals
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* How It Works */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Getting started is simple. Follow these steps to begin your freelance
          journey.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md group hover:border-gray-900 transition-all duration-300"
            >
              <div className="text-gray-900 group-hover:text-black mb-6 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose QuickGigs */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="bg-linear-to-br from-gray-50 to-white rounded-2xl p-12 border border-gray-200 shadow-sm">
          <h2 className="text-4xl font-bold mb-4">Why Choose QuickGigs</h2>
          <p className="text-gray-600 mb-12 max-w-2xl">
            We understand the unique challenges of balancing academics with
            professional growth. QuickGigs is built specifically for students.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Student Success Stories
        </h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Hear from students who transformed their skills into income while
          managing their studies.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
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

      {/* Student Leaderboard */}
      <section className="mt-32 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Top Performing Students</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Meet our top achievers who are excelling in their freelance journey
            while pursuing their education.
          </p>
        </div>

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
                {leaderboard.map((student, index) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {[
            {
              icon: <Trophy className="w-8 h-8 text-purple-600" />,
              title: 'Elite Badge',
              description:
                'Complete 40+ gigs with 4.8+ rating to earn the Elite badge.',
              color: 'border-purple-200',
            },
            {
              icon: <Medal className="w-8 h-8 text-blue-600" />,
              title: 'Pro Badge',
              description:
                'Complete 30+ gigs with 4.5+ rating to earn the Pro badge.',
              color: 'border-blue-200',
            },
            {
              icon: <Star className="w-8 h-8 text-green-600" />,
              title: 'Rising Star',
              description:
                'Complete 20+ gigs with 4.0+ rating to earn Rising Star.',
              color: 'border-green-200',
            },
          ].map((badge, index) => (
            <div
              key={index}
              className={`bg-white p-6 rounded-xl border ${badge.color} shadow-sm hover:shadow-md transition-all`}
            >
              {badge.icon}
              <h3 className="font-bold text-xl mt-4 mb-2">{badge.title}</h3>
              <p className="text-gray-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mt-32 px-6 max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-600 text-center mb-12">
          Everything you need to know about getting started on QuickGigs.
        </p>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem key={index} faq={faq} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto bg-linear-to-br from-black to-gray-900 rounded-2xl p-12 text-center text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Start Earning?</h2>
            <p className="text-lg text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are building their careers, earning
              money, and gaining real-world experience.
            </p>
            <Link href="/register">
              <button className="bg-white text-black px-8 py-4 rounded-md text-lg font-medium hover:bg-gray-100 transition-all cursor-pointer">
                Get Started Now
              </button>
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2V6h4V4H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                backgroundSize: '30px 30px',
              }}
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-20">
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

function FAQItem({
  faq,
  index,
}: {
  faq: { question: string; answer: string }
  index: number
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-lg pr-8">{faq.question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-5 text-gray-600 leading-relaxed">
          {faq.answer}
        </div>
      </div>
    </div>
  )
}
