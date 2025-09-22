// src/components/AdminDashboard.jsx
import React from "react";

import { Search, Bell, Users, UserCheck, Wallet, Calendar } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { date: "1 Jun", car: 900, bike: 300 },
  { date: "5 Jun", car: 1200, bike: 600 },
  { date: "10 Jun", car: 850, bike: 400 },
  { date: "15 Jun", car: 1600, bike: 800 },
  { date: "20 Jun", car: 1400, bike: 650 },
  { date: "25 Jun", car: 1800, bike: 1000 },
  { date: "30 Jun", car: 2100, bike: 1250 },
];

export default function AdminDashboard() {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-500">Friday, June 30, 2023</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 border rounded-xl w-64"
            />
          </div>
          <Bell className="w-6 h-6 text-gray-500" />
          <Button className="bg-yellow-400 text-black font-semibold rounded-xl">
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Customers</p>
              <h2 className="text-2xl font-bold">2,548</h2>
              <p className="text-green-600 text-sm">+125 this month</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Washing Persons</p>
              <h2 className="text-2xl font-bold">78</h2>
              <p className="text-green-600 text-sm">+8 this month</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-500" />
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Revenue</p>
              <h2 className="text-2xl font-bold">₹52,945</h2>
              <p className="text-green-600 text-sm">+₹8,235 this month</p>
            </div>
            <Wallet className="w-10 h-10 text-purple-500" />
          </CardContent>
        </Card>

        <Card className="p-4">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Active Bookings</p>
              <h2 className="text-2xl font-bold">156</h2>
              <p className="text-yellow-600 text-sm">24 in progress now</p>
            </div>
            <Calendar className="w-10 h-10 text-yellow-500" />
          </CardContent>
        </Card>
      </div>

      {/* Chart + Activities */}
      <div className="grid grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <Card className="col-span-2 p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Revenue Over Time</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary">
                30 Days
              </Button>
              <Button size="sm" variant="ghost">
                90 Days
              </Button>
              <Button size="sm" variant="ghost">
                1 Year
              </Button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="car" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="bike" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#facc15" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="car"
                stroke="#3b82f6"
                fill="url(#car)"
              />
              <Area
                type="monotone"
                dataKey="bike"
                stroke="#facc15"
                fill="url(#bike)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Recent Activities */}
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold">Recent Activities</h2>
            <a href="#" className="text-blue-500 text-sm">
              View All
            </a>
          </div>
          <ul className="space-y-4 text-sm">
            <li>
              <p className="font-semibold">New Customer Registration</p>
              <p className="text-gray-500">Sarah Johnson • 10 mins ago</p>
            </li>
            <li>
              <p className="font-semibold">Booking Completed</p>
              <p className="text-gray-500">
                Michael Roberts • 25 mins ago
              </p>
            </li>
            <li>
              <p className="font-semibold">New Booking</p>
              <p className="text-gray-500">Emily Chen • 45 mins ago</p>
            </li>
            <li>
              <p className="font-semibold">Booking Completed</p>
              <p className="text-gray-500">Robert Brown • 1 hr ago</p>
            </li>
            <li>
              <p className="font-semibold">New Washing Person</p>
              <p className="text-gray-500">Carlos Martinez • 2 hrs ago</p>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
