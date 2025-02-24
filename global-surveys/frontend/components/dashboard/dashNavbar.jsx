// dashNavbar.jsx
import { Bell, Search } from "lucide-react";

const DashNavbar = () => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-30">
      <div className="px-4 py-3 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-semibold">SurveyPay</span>
          </div>

          <div className="flex-1 max-w-lg mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </button>
            <div className="flex items-center space-x-2">
              <img
                className="h-8 w-8 rounded-full"
                src="/api/placeholder/32/32"
                alt="User"
              />
              <span className="hidden md:inline-block text-sm font-medium text-gray-700">
                John Doe
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DashNavbar;
