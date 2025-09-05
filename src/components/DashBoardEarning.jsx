// src/components/DashBoardEarning.jsx
import React from "react";
import {
  Wallet,
  ShoppingCart,
  Star,
  Droplets,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Sidebar from "./Sidebar";
import EarningsHistory from "./EarningHistory";

export default function DashBoardEarning() {
  const earningsData = [
    { day: "Mon", car: 40, bike: 15 },
    { day: "Tue", car: 60, bike: 30 },
    { day: "Wed", car: 30, bike: 10 },
    { day: "Thu", car: 50, bike: 20 },
    { day: "Fri", car: 65, bike: 25 },
    { day: "Sat", car: 80, bike: 40 },
    { day: "Sun", car: 55, bike: 35 },
  ];

  const serviceData = [
    { name: "Basic", value: 25 },
    { name: "Standard", value: 45 },
    { name: "Premium", value: 30 },
  ];

  const COLORS = ["#2563eb", "#facc15", "#22c55e"];

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
            <h1 className="text-xl font-bold">Earnings & History</h1>
            <p className="text-gray-500">Friday, June 10, 2023</p>
          </div>
          <button className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg font-semibold shadow">
            View Schedule
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Total Earnings */}
          <div className="bg-white shadow rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="text-blue-600" />
              <span className="text-gray-500 text-sm">Total Earnings</span>
            </div>
            <h2 className="text-2xl font-bold">₹224.00</h2>
            <p className="text-green-600 text-sm">+12.5% from last week</p>
          </div>

          {/* Completed Jobs */}
          <div className="bg-white shadow rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart className="text-blue-600" />
              <span className="text-gray-500 text-sm">Completed Jobs</span>
            </div>
            <h2 className="text-2xl font-bold">7</h2>
            <p className="text-gray-400 text-sm">5 Car • 2 Bike</p>
          </div>

          {/* Tips Earned */}
          <div className="bg-white shadow rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="text-blue-600" />
              <span className="text-gray-500 text-sm">Tips Earned</span>
            </div>
            <h2 className="text-2xl font-bold">₹33.50</h2>
            <p className="text-red-500 text-sm">-3.2% from last week</p>
          </div>

          {/* Customer Rating */}
          <div className="bg-white shadow rounded-2xl p-4 flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Star className="text-blue-600" />
              <span className="text-gray-500 text-sm">Customer Rating</span>
            </div>
            <h2 className="text-2xl font-bold">4.8/5.0</h2>
            <p className="text-yellow-500">★★★★★</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Earnings Trend */}
          <div className="bg-white shadow rounded-2xl p-4 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Earnings Trend</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-600 rounded-lg">
                  Weekly
                </button>
                <button className="px-3 py-1 text-sm text-gray-600">Monthly</button>
                <button className="px-3 py-1 text-sm text-gray-600">Yearly</button>
                <button className="px-3 py-1 text-sm border rounded-lg">Export</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={earningsData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="car" name="Car Wash" fill="#2563eb" />
                <Bar dataKey="bike" name="Bike Wash" fill="#facc15" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Service Distribution */}
          <div className="bg-white shadow rounded-2xl p-4">
            <h3 className="font-semibold mb-4">Service Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={serviceData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  label
                >
                  {serviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Earnings History Table (Full Width Below) */}
        <EarningsHistory />
      </div>
    </div>
  );
}
