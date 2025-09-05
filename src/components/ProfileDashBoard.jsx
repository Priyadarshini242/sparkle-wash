// src/components/ProfileDashboard.jsx
import React, { useState } from "react";
import { ShoppingCart, Star, Wallet, CheckCircle } from "lucide-react";
import Sidebar from "./Sidebar";
import ProfileDetails from "./ProfileDetails";

export default function ProfileDashboard() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Your Profile</h1>
            <p className="text-gray-500">Friday, June 10, 2023</p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold shadow">
            View Schedule
          </button>
        </div>

        {/* Current Status */}
        <div className="bg-white shadow rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h3 className="text-gray-700 font-semibold">Your Current Status</h3>
            <p className="text-gray-500 text-sm">
              Toggle your availability for new wash requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`font-medium ${
                available ? "text-green-600" : "text-gray-400"
              }`}
            >
              Available
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={() => setAvailable(!available)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-green-500 transition"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full shadow peer-checked:translate-x-5 transition"></div>
            </label>
            <span
              className={`font-medium ${
                !available ? "text-red-500" : "text-gray-400"
              }`}
            >
              Busy
            </span>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Completed Washes */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
            <ShoppingCart className="text-blue-500 mb-2" size={28} />
            <h2 className="text-2xl font-bold">124</h2>
            <p className="text-gray-500">Completed Washes</p>
          </div>

          {/* Average Rating */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
            <Star className="text-blue-500 mb-2" size={28} />
            <h2 className="text-2xl font-bold">4.8</h2>
            <p className="text-gray-500">Average Rating</p>
          </div>

          {/* Total Earnings */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
            <Wallet className="text-blue-500 mb-2" size={28} />
            <h2 className="text-2xl font-bold">$1,450</h2>
            <p className="text-gray-500">Total Earnings</p>
          </div>

          {/* Satisfaction Rate */}
          <div className="bg-white shadow rounded-2xl p-6 flex flex-col items-center">
            <CheckCircle className="text-blue-500 mb-2" size={28} />
            <h2 className="text-2xl font-bold">98%</h2>
            <p className="text-gray-500">Satisfaction Rate</p>
          </div>
        </div>
             <ProfileDetails/>


      </div>
    </div>
  );
}
