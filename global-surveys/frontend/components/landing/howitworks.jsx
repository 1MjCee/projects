import { UserPlus, ClipboardList, Banknote, ArrowRight } from "lucide-react";

export default function HowItWorks() {
  const steps = [
    {
      icon: UserPlus,
      title: "Sign Up",
      description:
        "Create your free account in less than 2 minutes. No credit card required.",
      color: "blue",
      stats: "2 minute setup",
      action: "Create Account",
    },
    {
      icon: ClipboardList,
      title: "Complete Surveys",
      description:
        "Answer questions and earn money for each response. New surveys added daily.",
      color: "green",
      stats: "$1 per question",
      action: "View Surveys",
    },
    {
      icon: Banknote,
      title: "Get Paid",
      description:
        "Withdraw your earnings instantly via Stripe to your bank account.",
      color: "purple",
      stats: "Instant payout",
      action: "Learn More",
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Start earning money in three simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines (hidden on mobile) */}
          <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gray-200" />

          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Card */}
              <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 text-center group">
                {/* Icon */}
                <div
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-6 
                  ${
                    index === 0
                      ? "bg-blue-100 text-blue-600"
                      : index === 1
                      ? "bg-green-100 text-green-600"
                      : "bg-purple-100 text-purple-600"
                  }`}
                >
                  <step.icon className="h-8 w-8" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-gray-600 mb-6">{step.description}</p>

                {/* Stats */}
                <div className="bg-gray-50 rounded-lg py-3 px-4 mb-6">
                  <span className="font-medium text-gray-900">
                    {step.stats}
                  </span>
                </div>

                {/* Action Button */}
                <button
                  className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center 
                  ${
                    index === 0
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : index === 1
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-purple-600 hover:bg-purple-700 text-white"
                  } 
                  transition-colors duration-300`}
                >
                  {step.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            Join thousands of users already earning with us
          </p>
          <button className="bg-gray-900 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-300 focus:ring-4 focus:ring-gray-200">
            Get Started Now
          </button>
        </div>
      </div>
    </section>
  );
}
