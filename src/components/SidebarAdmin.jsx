// src/components/Sidebar.jsx
import React from "react";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Usermanagement from "./Usermanagement";

export default function SidebarAdmin() {
  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={18} />, active: true },
    { name: "Bookings", icon: <Calendar size={18} /> },
    { name: "User Management", icon: <Users size={18} /> },
    { name: "Earnings", icon: <BarChart3 size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
    { name: "Help & Support", icon: <HelpCircle size={18} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white flex flex-col justify-between">
        {/* Top Section */}
        <div>
          {/* Logo */}
          <div className="mb-6 flex items-center gap-3">
            <div className="text-2xl">💧</div>
            <div className="text-lg font-semibold">SparkleWash</div>
          </div>

          {/* User Info */}
          <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
            <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white font-semibold">
              A
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Admin Protal
              </div>
              <div className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
                System Administrator
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2 px-4">
            {menu.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition ${
                  item.active ? "bg-blue-500" : ""
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.name}</span>
              </div>
            ))}
          </nav>
        </div>
        {/* Bottom Logout */}
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-blue-500 transition">
            <LogOut size={18} />
            <span className="text-sm">Sign Out</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 bg-white shadow rounded-xl p-4 m-6 overflow-auto">
        <Usermanagement />
      </div>
    </div>
  );
}
