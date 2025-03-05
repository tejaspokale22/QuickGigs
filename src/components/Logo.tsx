import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center text-[20px] font-bold tracking-normal text-gray-900 logo-font"
    >
      QuickGigs
    </Link>
  )
}

export default Logo
