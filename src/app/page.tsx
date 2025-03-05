import Image from "next/image";
import Google from "../../public/google-icon.svg";

export default function Home() {
  const features = [
    {
      title: "Quick Tasks",
      description: "Browse and pick from a wide range of quick and easy tasks that perfectly match your skills and schedule.",
      image: "/globe.svg",
    },
    {
      title: "Quick Pay",
      description: "Complete tasks and get paid instantly through our secure payment system. No delays, no hassle.",
      image: Google,
    },
    {
      title: "Freelancer Community",
      description: "Join a thriving community of micro-freelancers, build your reputation, and unlock better opportunities.",
      image: Google,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="pt-32 px-6 max-w-6xl mx-auto text-center relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-black text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800">
            Welcome to <span className="text-blue-600">QuickGigs!</span>
          </h1>
          <div className="text-gray-700 text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            Your platform for <span className="font-semibold text-blue-600">Quick Tasks</span>
            {" "}and <span className="font-semibold text-blue-600">Quick Pay</span>. Start earning
            today by completing small gigs effortlessly!
          </div>
          <div className="mt-8 flex gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-700 transition-all hover:scale-105 hover:shadow-xl">
              Get Started
            </button>
            <button className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-blue-50 transition-all">
              Learn More
            </button>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 -z-10 opacity-10">
          <div className="w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 opacity-10">
          <div className="w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">
          Why Choose QuickGigs?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg border border-gray-100 text-center transform transition-all hover:shadow-xl hover:-translate-y-1"
            >
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="mt-32 mb-20 px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Sign up now and discover how QuickGigs can help you earn more in less
              time. Join thousands of freelancers boosting their income today!
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold shadow-lg hover:bg-blue-50 transition-all hover:scale-105">
              Join Now
            </button>
          </div>
          
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-full h-full">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full opacity-20 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400 rounded-full opacity-20 blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
          </div>
        </div>
      </section>
    </div>
  );
}


