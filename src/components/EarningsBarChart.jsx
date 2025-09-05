
// export default function EarningsBarChart() {
// export default function EarningsBarChart() {

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", Car: 45 },
  { name: "Tue", Car: 65 },
  { name: "Wed", Car: 35 },
  { name: "Thu", Car: 55 },
  { name: "Fri", Car: 68 },
  { name: "Sat", Car: 80 },
  { name: "Sun", Car: 0 },
];

export default function EarningsBarChart() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
      {/* Earnings Chart */}
      <div className="lg:col-span-2 bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-semibold mb-4">Recent Earnings</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Car" fill="#2563eb" radius={[8, 8, 0, 0]} /> 
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Earnings Summary */}
      <div className="bg-white rounded-2xl shadow p-5 flex flex-col justify-between">
        <h2 className="text-lg font-semibold mb-4">Earnings Summary</h2>

        <div className="space-y-3">
          {/* This Week */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>This Week</span>
              <span className="text-blue-600 font-semibold">₹355.00</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full w-[90%]"></div>
            </div>
          </div>

          {/* Pending Payments */}
          <div>
            <div className="flex justify-between text-sm font-medium mb-1">
              <span>Pending Payments</span>
              <span className="text-yellow-600 font-semibold">₹78.50</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full">
              <div className="h-2 bg-yellow-400 rounded-full w-[20%]"></div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-gray-600 text-sm">Completed Jobs</p>
            <p className="text-xl font-semibold">16</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-gray-600 text-sm">Rating</p>
            <p className="text-xl font-semibold text-green-600">4.8 ✅</p>
          </div>
        </div>

        {/* Link */}
        <div className="mt-6">
          <button className="text-blue-600 hover:underline text-sm font-medium">
            View Complete History →
          </button>
        </div>
      </div>
    </div>
  );
}
