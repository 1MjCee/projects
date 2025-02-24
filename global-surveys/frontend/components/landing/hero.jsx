import Link from "next/link";
import { DollarSign, Clock, CheckCircle, ArrowRight } from "lucide-react";

export default function Hero() {
  const features = [
    { icon: DollarSign, text: "Get paid $1 per question" },
    { icon: Clock, text: "Fast 24-hour payouts" },
    { icon: CheckCircle, text: "100% free to join" },
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Main Heading */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 leading-tight">
              Earn Money by Taking
              <span className="block">Online Surveys!</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 mb-8">
              Join thousands of users who earn extra income by sharing their
              opinions. Start earning today!
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/how-it-works"
              className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-400 transition-all duration-300 border border-blue-400"
            >
              Learn More
            </Link>
          </div>

          {/* Feature List */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-lg p-4 backdrop-blur-sm"
              >
                <feature.icon className="h-5 w-5 mr-2 text-blue-200" />
                <span className="text-blue-50">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-blue-100 text-sm">
            <div className="flex items-center justify-center space-x-2">
              <span>★★★★★</span>
              <span>Trusted by 10,000+ users</span>
              <span>•</span>
              <span>$1M+ paid out</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0 32L48 37.3C96 43 192 53 288 58.7C384 64 480 64 576 58.7C672 53 768 43 864 37.3C960 32 1056 32 1152 37.3C1248 43 1344 53 1392 58.7L1440 64V0H0V32Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
