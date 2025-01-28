import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center text-[26px] text-black font-bold rounded-md logo-font"
    >
      QuickGigs
    </Link>
  );
};

export default Logo;
