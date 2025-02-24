"use client";

import {
  Home,
  ClipboardList,
  DollarSign,
  CheckSquare,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    {
      icon: ClipboardList,
      label: "Available Surveys",
      href: "/dashboard/surveys",
    },
    { icon: DollarSign, label: "Earnings", href: "/dashboard/earnings" },
    { icon: CheckSquare, label: "Completed", href: "/dashboard/completed" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: HelpCircle, label: "Help", href: "/help" },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-gray-800 text-white transition-all duration-300 z-50 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Logo Section */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-700">
        {!isCollapsed && (
          <span className="text-xl font-semibold">SurveyPay</span>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-gray-400 hover:text-white"
        >
          {isCollapsed ? ">" : "<"}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center px-2 py-2 text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            <item.icon className="h-5 w-5 mr-2" />
            {!isCollapsed && <span>{item.label}</span>}
          </a>
        ))}
      </nav>
    </aside>
  );
}

// Navbar.jsx
export function Navbar() {
  return (
    <nav
      className={`fixed top-0 right-0 h-16 bg-white border-b border-gray-200 transition-all duration-300 pl-4 
      left-64`}
    >
      {" "}
      {/* Align with sidebar width */}
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <input
            type="search"
            placeholder="Search..."
            className="w-64 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <span className="sr-only">Notifications</span>
            <div className="relative">
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </div>
              {/* Bell icon */}
            </div>
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/api/placeholder/32/32"
              alt="User avatar"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-sm font-medium">John Doe</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
