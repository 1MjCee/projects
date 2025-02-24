import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "John Doe",
      quote: "I earned $50 in just a week! Highly recommend SurveyPay.",
    },
    {
      id: 2,
      name: "Jane Smith",
      quote: "Easy to use, and the payouts are fast. Love it!",
    },
    {
      id: 2,
      name: "Jane Smith",
      quote: "Easy to use, and the payouts are fast. Love it!",
    },
    {
      id: 2,
      name: "Jane Smith",
      quote: "Easy to use, and the payouts are fast. Love it!",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Users Say
          </h2>
          <p className="text-xl text-gray-600">
            Join thousands of satisfied users who earn rewards by sharing their
            opinions
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-8 relative group"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 bg-blue-500 rounded-full p-2 shadow-lg">
                <Quote className="h-4 w-4 text-white" />
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < (testimonial.rating || 5)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-200 fill-gray-200"
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 text-lg mb-6 italic">
                "{testimonial.quote}"
              </p>

              {/* User Info */}
              <div className="flex items-center">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  <img
                    src={testimonial.avatar || "/api/placeholder/48/48"}
                    alt={testimonial.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {testimonial.earned
                      ? `Earned $${testimonial.earned}`
                      : "Verified User"}
                  </p>
                </div>
              </div>

              {/* Optional Badges */}
              {testimonial.badges && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  {testimonial.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Optional Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6">
            Join our community of {testimonials.length * 1000}+ survey takers
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300 focus:ring-4 focus:ring-blue-100">
            Start Earning Today
          </button>
        </div>
      </div>
    </section>
  );
}
