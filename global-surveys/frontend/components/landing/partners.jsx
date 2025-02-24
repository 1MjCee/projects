"use client";

import { Building2 } from "lucide-react";

const Partners = () => {
  const partners = [
    { name: "Google", imageSrc: "/api/placeholder/100/40" },
    { name: "Microsoft", imageSrc: "/api/placeholder/100/40" },
    { name: "Amazon", imageSrc: "/api/placeholder/100/40" },
    { name: "Apple", imageSrc: "/api/placeholder/100/40" },
    { name: "Meta", imageSrc: "/api/placeholder/100/40" },
    { name: "IBM", imageSrc: "/api/placeholder/100/40" },
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            We partner with leading companies worldwide
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="flex justify-center items-center col-span-1 p-4"
              >
                <div className="flex flex-col items-center space-y-2 group">
                  <div className="w-24 h-12 bg-white rounded-lg shadow-sm flex items-center justify-center group-hover:shadow-md transition-shadow duration-200">
                    <Building2 className="w-8 h-8 text-gray-400 group-hover:text-gray-600 transition-colors duration-200" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">
                    {partner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <p className="text-base text-gray-600">
            Join thousands of satisfied customers who trust our platform
          </p>
        </div>
      </div>
    </section>
  );
};

export default Partners;
