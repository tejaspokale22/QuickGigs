import Image from "next/image";
import Google from "../../public/google-icon.svg";

export default function Home() {
  return (
    <div className="p-8">
      {/* Hero Section */}
      <section className="text-center mb-10">
        <h1 className="text-black text-4xl font-bold">
          Welcome to{" "}
          <span className="logo-font text-purple-950">QuickGigs!</span>
        </h1>
        <p className="text-gray-700 text-lg mt-4">
          Your platform for <span className="font-semibold">Quick Tasks</span>{" "}
          and <span className="font-semibold">Quick Pay</span>. Start earning by
          completing small gigs today!
        </p>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Feature 1 */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <Image
            src="/globe.svg" // Image from public folder
            alt="Quick Tasks"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="text-xl font-bold text-purple-900 text-center mt-4">
            Quick Tasks
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Browse and pick from a wide range of quick and easy tasks that match
            your skills.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <Image
            src={Google} // Image from public folder
            alt="Quick Pay"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="text-xl font-bold text-purple-900 text-center mt-4">
            Quick Pay
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Complete tasks and get paid instantly. No delays, no hassle.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <Image
            src={Google}
            alt="Freelancer Community"
            width={100}
            height={100}
            className="mx-auto"
          />
          <h2 className="text-xl font-bold text-purple-900 text-center mt-4">
            Freelancer Community
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Join a growing community of micro-freelancers and build your profile
            with great reviews.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-12 text-center">
        <h2 className="text-2xl font-bold text-purple-950">
          Ready to Get Started?
        </h2>
        <p className="text-gray-700 mt-4">
          Sign up now and discover how QuickGigs can help you earn more in less
          time.Register Now!
        </p>
        <button className="mt-6 bg-purple-950 text-white px-6 py-2 rounded shadow-md hover:bg-purple-900">
          Join Now
        </button>
      </section>
    </div>
  );
}
