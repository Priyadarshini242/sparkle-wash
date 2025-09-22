// src/components/ServiceManagement.jsx
import React, { useState } from "react";
import { Search, Filter, Eye, MoreVertical, FileDown } from "lucide-react";
import { Car, Bike } from "lucide-react";

export default function ServiceManagement() {
  const [data] = useState([
    {
      id: "BK-1234",
      customer: "Sarah Johnson",
      washer: "Michael S.",
      service: "Car Wash",
      date: "15 Jul 2023 10:30 AM",
      status: "Completed",
      cost: "₹35.00",
    },
    {
      id: "BK-1235",
      customer: "David Wilson",
      washer: "Jennifer L.",
      service: "Bike Wash",
      date: "15 Jul 2023 11:15 AM",
      status: "In Progress",
      cost: "₹22.50",
    },
    {
      id: "BK-1236",
      customer: "Emily Chen",
      washer: "Robert T.",
      service: "Car Wash",
      date: "15 Jul 2023 12:45 PM",
      status: "Cancelled",
      cost: "₹42.00",
    },
     {
      id: "BK-1237",
      customer: "Michael Roberts",
      washer: "Carlos P.",
      service: "Car Wash",
      date: "14 Jul 2023 03:30 PM",
      status: "Completed",
      cost: "₹35.00",
    },
     {
      id: "BK-1238",
      customer: "Jessica Brown",
      washer: "Sarah W.",
      service: "Bike Wash",
      date: "14 Jul 2023 04:15 PM",
      status: "Completed",
      cost: "₹18.50",
    },
     {
      id: "BK-1239",
      customer: "Thomas Martinez",
      washer: "David K.",
      service: "Car Wash",
      date: "14 Jul 2023 05:00 PM",
      status: "In Progress",
      cost: "₹42.00",
    },
     {
      id: "BK-1240",
      customer: "Amanda Wilson",
      washer: "Lisa M.",
      service: "Car Wash",
      date: "13 Jul 2023 10:00 PM",
      status: "Completed",
      cost: "₹28.50",
    },
     {
      id: "BK-1241",
      customer: "Robert Johnson",
      washer: "Michael S.",
      service: "Bike Wash",
      date: "13 Jul 2023 11:30 PM",
      status: "Cancelled",
      cost: "₹22.50",
    }, 
  ]);

  // ✅ Avatar with first initial
  const getAvatar = (name) => {
    const initial = name.charAt(0).toUpperCase();
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-semibold">
          {initial}
        </div>
        <span>{name}</span>
      </div>
    );
  };

  // ✅ Service icons
 const getServiceType = (service) => {
  if (service === "Car Wash") {
    return (
      <span className="flex items-center gap-1 text-gray-600 font-medium">
        <Car className="w-4 h-4 text-blue-600" />
        Car Wash
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-gray-600 font-medium">
      <Bike className="w-4 h-4 text-orange-600" />
      Bike Wash
    </span>
  );
};

  // ✅ Status pill with icon
  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            ✅ Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            ⏳ In Progress
          </span>
        );
      case "Cancelled":
        return (
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            ❌ Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Service Management</h1>
          <p className="text-sm text-gray-500">Friday, July 15, 2023</p>
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow flex items-center gap-2">
          <FileDown size={16} /> Generate Report
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex items-center border rounded px-2 flex-1">
          <Search className="w-4 h-4 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search booking ID, customer name..."
            className="outline-none w-full text-sm"
          />
        </div>
        <select className="border rounded px-3 py-2 text-sm">
          <option>Status</option>
          <option>Completed</option>
          <option>In Progress</option>
          <option>Cancelled</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm">
          <option>Date Range</option>
          <option>Today</option>
          <option>This Week</option>
        </select>
        <select className="border rounded px-3 py-2 text-sm">
          <option>Service Type</option>
          <option>Car Wash</option>
          <option>Bike Wash</option>
        </select>
        <button className="border rounded px-3 py-2 text-sm flex items-center">
          <Filter className="w-4 h-4 mr-1" /> More Filters
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">
          Search
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Booking ID</th>
              <th className="p-3">Customer Name</th>
              <th className="p-3">Washing Person</th>
              <th className="p-3">Service Type</th>
              <th className="p-3">Date & Time</th>
              <th className="p-3">Status</th>
              <th className="p-3">Cost</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{row.id}</td>
                <td className="p-3">{getAvatar(row.customer)}</td>
                <td className="p-3">{row.washer}</td>
                <td className="p-3">{getServiceType(row.service)}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">{getStatusBadge(row.status)}</td>
                <td className="p-3">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-semibold">
                    {row.cost}
                  </span>
                </td>
                <td className="p-3 flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex justify-between items-center p-3 text-sm text-gray-500">
          <span>Showing {data.length} of 248 results</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-blue-600 text-white">
              1
            </button>
            <button className="px-3 py-1 border rounded">2</button>
            <button className="px-3 py-1 border rounded">3</button>
            <span>...</span>
            <button className="px-3 py-1 border rounded">31</button>
          </div>
        </div>
      </div>
    </div>
  );
}
