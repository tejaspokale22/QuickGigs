import Image from "next/image";
import Google from "../../public/google-icon.svg";

export default function Home() {
  return (
    <div className="pt-20 px-6 max-w-6xl mx-auto text-center">
      {/* Hero Section */}
      <section className="mb-16">
        <h1 className="text-black text-5xl font-extrabold leading-tight">
          Welcome to <span className="text-blue-600">QuickGigs!</span>
        </h1>
        <p className="text-gray-700 text-lg mt-4 max-w-3xl mx-auto">
          Your platform for <span className="font-semibold">Quick Tasks</span>
          {" "}and <span className="font-semibold">Quick Pay</span>. Start earning
          today by completing small gigs effortlessly!
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {features.map((feature, index) => (
          <div key={index} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200 text-center">
            <Image
              src={feature.image}
              alt={feature.title}
              width={100}
              height={100}
              className="mx-auto"
            />
            <h2 className="text-xl font-bold text-black mt-4">{feature.title}</h2>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </section>

      {/* Call to Action Section */}
      <section className="mt-16 text-center bg-gray-100 py-10 rounded-lg shadow-inner">
        <h2 className="text-3xl font-bold text-black">Ready to Get Started?</h2>
        <p className="text-gray-700 mt-4 max-w-2xl mx-auto">
          Sign up now and discover how QuickGigs can help you earn more in less
          time. Join thousands of freelancers boosting their income today!
        </p>
        <button className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-700 transition">
          Join Now
        </button>
      </section>
    </div>
  );
}

const features = [
  {
    title: "Quick Tasks",
    description: "Browse and pick from a wide range of quick and easy tasks that match your skills.",
    image: "/globe.svg",
  },
  {
    title: "Quick Pay",
    description: "Complete tasks and get paid instantly. No delays, no hassle.",
    image: Google,
  },
  {
    title: "Freelancer Community",
    description: "Join a growing community of micro-freelancers and build your profile with great reviews.",
    image: Google,
  },
];
