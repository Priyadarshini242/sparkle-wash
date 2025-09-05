
// src/components/EarningsHistory.jsx
import React from "react";
import { Search, Filter, MoreVertical, MapPin, Car, Bike } from "lucide-react";

export default function EarningsHistory() {
  const data = [
    {
      id: "E-2023-042",
      date: "June 10, 2023 10:30 AM",
      customer: "Sarah Johnson",
      service: { type: "Car Wash", plan: "Premium", icon: <Car className="w-4 h-4 text-gray-600" /> },
      location: "Downtown Car Hub",
      fee: "₹35.00",
      tip: "₹5.00",
      total: "₹40.00",
    },
    {
      id: "E-2023-041",
      date: "June 10, 2023 01:15 PM",
      customer: "Michael Roberts",
      service: { type: "Car Wash", plan: "Standard", icon: <Car className="w-4 h-4 text-gray-600" /> },
      location: "Westside Mall Parking",
      fee: "₹25.00",
      tip: "₹3.50",
      total: "₹28.50",
    },
    {
      id: "E-2023-040",
      date: "June 9, 2023 11:00 AM",
      customer: "Emily Chen",
      service: { type: "Bike Wash", plan: "Basic", icon: <Bike className="w-4 h-4 text-gray-500" /> },
      location: "Parkview Apartments",
      fee: "₹18.50",
      tip: "₹2.00",
      total: "₹20.50",
    },
    {
      id: "E-2023-039",
      date: "June 9, 2023 03:30 PM",
      customer: "David Wilson",
      service: { type: "Car Wash", plan: "Premium", icon: <Car className="w-4 h-4 text-gray-600" /> },
      location: "Downtown Car Hub",
      fee: "₹35.00",
      tip: "₹7.50",
      total: "₹42.50",
    },
    {
      id: "E-2023-038",
      date: "June 8, 2023 09:45 AM",
      customer: "Jennifer Lopez",
      service: { type: "Bike Wash", plan: "Standard", icon: <Bike className="w-4 h-4 text-gray-500" /> },
      location: "Central Bike Station",
      fee: "₹22.00",
      tip: "₹3.00",
      total: "₹25.00",
    },
    {
      id: "E-2023-037",
      date: "June 8, 2023 02:00 PM",
      customer: "Robert Brown",
      service: { type: "Car Wash", plan: "Basic", icon: <Car className="w-4 h-4 text-gray-600" /> },
      location: "Eastside Service Center",
      fee: "₹20.00",
      tip: "₹2.50",
      total: "₹22.50",
    },
    {
      id: "E-2023-036",
      date: "June 7, 2023 10:15 AM",
      customer: "Alex Thompson",
      service: { type: "Car Wash", plan: "Premium", icon: <Car className="w-4 h-4 text-gray-600" /> },
      location: "Downtown Car Hub",
      fee: "₹35.00",
      tip: "₹10.00",
      total: "₹45.00",
    },
  ];

  return (
    <div className="bg-white shadow rounded-2xl p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <h2 className="text-lg font-semibold">Earnings History</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, customer..."
              className="pl-8 pr-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
          <button className="flex items-center gap-1 px-3 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="px-3 py-2 border rounded-lg text-sm text-blue-600 hover:bg-blue-50">
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-gray-500 border-b">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Service</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Service Fee</th>
              <th className="py-3 px-4">Tip</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-b last:border-0">
                <td className="py-3 px-4">{row.id}</td>
                <td className="py-3 px-4">{row.date}</td>
                <td className="py-3 px-4">{row.customer}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  {row.service.icon}
                  <div>
                    <p>{row.service.type}</p>
                    <p className="text-xs text-gray-500">{row.service.plan}</p>
                  </div>
                </td>
                <td className="py-3 px-4 flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {row.location}
                </td>
                <td className="py-3 px-4">{row.fee}</td>
                <td className="py-3 px-4 text-green-600">{row.tip}</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-400 text-black font-semibold px-2 py-1 rounded-lg">
                    {row.total}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <MoreVertical className="w-4 h-4 text-gray-400 cursor-pointer" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
        <p>Showing 7 of 48 results</p>
        <div className="flex gap-1">
          <button className="px-3 py-1 border rounded-lg bg-blue-600 text-white">1</button>
          <button className="px-3 py-1 border rounded-lg">2</button>
          <button className="px-3 py-1 border rounded-lg">3</button>
          <span className="px-3 py-1">...</span>
          <button className="px-3 py-1 border rounded-lg">7</button>
        </div>
      </div>
    </div>
  );
}
