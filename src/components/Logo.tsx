import Link from 'next/link'

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center text-[22px] font-semibold tracking-normal text-black-700 logo-font"
    >
      QuickGigs
    </Link>
  )
}

export default Logo
