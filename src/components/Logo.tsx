import Link from "next/link";

const Logo: React.FC = () => {
  return (
    <Link
      href="/"
      className="flex items-center text-2xl text-black rounded-md font-extrabold leading-tight"
    >
      QuickGigs
    </Link>
  );
};

export default Logo;
