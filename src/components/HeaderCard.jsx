import React, { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";


export default function HeaderCard() {
  const [available, setAvailable] = useState(true);
  
  return (
    <div className="bg-white shadow-md rounded-2xl p-3 space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center">
        {/* Welcome & Date */}
        <div>
          <h1 className="text-5xl font-semibold text-gray-800">
            Welcome, Michael!
          </h1>
          <p className="text-gray-500 text-start text-sm">Friday, June 10, 2023</p>
        </div>

        {/* Notifications + Button */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              3
            </span>
          </div>

          {/* View Schedule Button */}
          <button className="bg-yellow-400 hover:bg-yellow-500 text-blue font-semibold px-5 py-2 rounded-lg shadow-md">
            View Schedule
          </button>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200" />

      {/* Status Section */}
      <div className="flex justify-between items-center bg-gray-50 rounded-xl p-4">
        <div>
          <h2 className="font-medium  text-start text-gray-800">Your Current Status</h2>
          <p className="text-sm text-gray-500">
            Toggle your availability for new wash requests
          </p>
        </div>

        {/* Toggle Switch */}
        <div className="flex items-center gap-3">
          <span className={available ? "text-green-600 font-medium" : "text-gray-400"}>
            Available
          </span>

          <button
            onClick={() => setAvailable(!available)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition ${
              available ? "bg-yellow-400" : "bg-gray-300"
            }`}
          >
            <div
              className={`bg-white w-5 h-5 rounded-full shadow-md transform transition ${
                available ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span className={!available ? "text-yellow-600 font-medium" : "text-gray-400"}>
            Busy
          </span>
        </div>
       </div>
      </div>
  );
}
