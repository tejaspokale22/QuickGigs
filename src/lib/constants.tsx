import {
  Megaphone,
  PenTool,
  Monitor,
  Image as ImageIcon,
  Smartphone,
  TrendingUp,
  FileText,
  Presentation,
  LucideIcon,
  Globe,
  Database,
  Users,
} from 'lucide-react'
import { formatCurrency } from '@/app/utils/utilityFunctions'

export const features = [
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

export const testimonials = [
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

export const categories: Array<{
  title: string
  proposals: number
  icon: LucideIcon
}> = [
  {
    title: 'Digital Marketing',
    proposals: 635,
    icon: Megaphone,
  },
  {
    title: 'Digital Writing',
    proposals: 409,
    icon: FileText,
  },
  {
    title: 'Graphic Design',
    proposals: 525,
    icon: PenTool,
  },
  {
    title: 'Presentation',
    proposals: 13,
    icon: Presentation,
  },
  {
    title: 'Photo & Video',
    proposals: 280,
    icon: ImageIcon,
  },
  {
    title: 'Mobile Apps',
    proposals: 68,
    icon: Smartphone,
  },
  {
    title: 'Web Development',
    proposals: 203,
    icon: Monitor,
  },
  {
    title: 'SEO',
    proposals: 105,
    icon: TrendingUp,
  },
  {
    title: 'Video Editing',
    proposals: 187,
    icon: ImageIcon,
  },
  {
    title: 'Translation',
    proposals: 142,
    icon: Globe,
  },
  {
    title: 'Data Entry',
    proposals: 321,
    icon: Database,
  },
  {
    title: 'Social Media',
    proposals: 298,
    icon: Users,
  },
]

export const faqs = [
  {
    question: 'How do I get started on QuickGigs?',
    answer:
      'Simply create an account, complete your profile with your skills and experience, and start browsing available gigs. You can apply to projects that match your abilities and schedule.',
  },
  {
    question: 'Is QuickGigs really free for students?',
    answer:
      'Yes! Creating an account and browsing gigs is completely free. We only charge a small service fee when you successfully complete a paid project.',
  },
  {
    question: 'How do payments work?',
    answer:
      'Once you complete a gig and the client approves your work, payment is processed securely through our platform. Funds are typically released within 3-5 business days.',
  },
  {
    question: 'Can I work on gigs while managing my studies?',
    answer:
      'Absolutely! QuickGigs is designed for students. Most projects are flexible and can be completed according to your schedule. You can choose gigs based on your availability.',
  },
  {
    question: 'What types of projects are available?',
    answer:
      'We offer a wide range of projects including web development, content writing, graphic design, digital marketing, mobile apps, video editing, and much more.',
  },
  {
    question: 'How do I build credibility on the platform?',
    answer:
      'Start with smaller projects to build your portfolio and gather positive reviews. Complete work on time, communicate effectively, and deliver quality results to earn badges and climb the leaderboard.',
  },
]

export const benefits = [
  'Flexible work hours that fit your class schedule',
  'Real projects from actual companies',
  'Build a professional portfolio while studying',
  'Earn competitive rates for your skills',
  'Network with industry professionals',
  'Gain practical experience in your field',
  'Access to mentorship and guidance',
  'Choose projects that match your interests',
]

export const leaderboard = [
  {
    rank: 1,
    name: 'Priya Sharma',
    university: 'IIT Delhi',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    gigsCompleted: 48,
    earnings: formatCurrency(120000),
    rating: 4.9,
    badge: 'Elite',
  },
  {
    rank: 2,
    name: 'Rahul Patel',
    university: 'BITS Pilani',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    gigsCompleted: 42,
    earnings: formatCurrency(95000),
    rating: 4.8,
    badge: 'Pro',
  },
  {
    rank: 3,
    name: 'Aisha Khan',
    university: 'VIT Vellore',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    gigsCompleted: 39,
    earnings: formatCurrency(88000),
    rating: 4.9,
    badge: 'Pro',
  },
  {
    rank: 4,
    name: 'Dev Kapoor',
    university: 'IIIT Hyderabad',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    gigsCompleted: 35,
    earnings: formatCurrency(82000),
    rating: 4.7,
    badge: 'Rising Star',
  },
  {
    rank: 5,
    name: 'Neha Gupta',
    university: 'NIT Trichy',
    avatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    gigsCompleted: 32,
    earnings: formatCurrency(75000),
    rating: 4.8,
    badge: 'Rising Star',
  },
]

export const stats = [
  { value: '5,000+', label: 'Active Freelancers' },
  { value: '10,000+', label: 'Projects Completed' },
  { value: '500+', label: 'Partner Universities' },
  { value: '₹2Cr+', label: 'Total Paid Out' },
]
