// src/App.js

import React, { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";
import { BellIcon } from "@heroicons/react/24/outline";

const customers = [
  {
    name: "Arun Kumar",
    phone: "9876543210",
    email: "arun.kumar@example.com",
    apartment: "Skyline Residency",
    doorNo: "A-101",
    packages: "Premium",
    carModel: "Honda City",
    price: "₹25,000",
    vehicleNo: "KA05MQ 5678",
    SubscriptionStartDate: "01/06/2025",
    SubscriptionEndDate: "06/06/2024",
     pendingwashes: "1",
     completedwashes: "3",
  },
  {
    name: "Priya Sharma",
    phone: "9876501234",
    email: "priya.sharma@example.com",
    apartment: "Greenwood Towers",
    doorNo: "B-204",
    packages: "Standard",
    carModel: "Hyundai i20",
    price: "₹18,500",
    vehicleNo: "TN28FP 0128",
    SubscriptionStartDate: "28/06/2025",
    SubscriptionEndDate: "01/06/2025",
    pendingwashes: "3",
     completedwashes: "1",
  },
  {
    name: "Rahul Verma",
    phone: "9988776655",
    email: "rahul.verma@example.com",
    apartment: "Lake View Apartments",
    doorNo: "C-305",
    packages: "Basic",
    carModel: "Maruti Swift",
    price: "₹12,000",
    vehicleNo: "MH12DE 1432",
    SubscriptionStartDate: "14/05/2021",
    SubscriptionEndDate: "28/06/2025",
     pendingwashes: "2",
     completedwashes: "2",
  },
];

function Usermanagement() {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/*Tob Header */}
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-500 text-start text-sm">Friday, June 30, 2023</p>
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
            Export User
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("customers")}
            className={`pb-2 ${
              activeTab === "customers"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Customer Management
          </button>
          <button
            onClick={() => setActiveTab("washing")}
            className={`pb-2 ${
              activeTab === "washing"
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500"
            }`}
          >
            Washing Person Management
          </button>
        </nav>
      </div>

      {/* Summary + Activity + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <UserSummary />
        <RecentActivity />
        <QuickActions />
      </div>

      {/* Table section */}
      <div className="bg-white p-4 rounded shadow">
        {/* Search + Filters */}
        <div className="flex flex-wrap justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Search customers..."
            className="border rounded px-3 py-2 w-full md:w-1/3 mb-2 md:mb-0"
          />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2">
              <option>Packages</option>
              <option>Premium</option>
              <option>Standard</option>
              <option>Basic</option>
            </select>
            <select className="border rounded px-3 py-2">
              <option>Car Model</option>
              <option>Honda</option>
              <option>Hyundai</option>
              <option>Maruti</option>
            </select>
            <button className="border rounded px-3 py-2">More Filters</button>
            <button className="bg-yellow-500 text-blue px-4 py-2 rounded hover:bg-yellow-600">
              Add New Customer
            </button>
          </div>
        </div>

        {/* Table */}
        <CustomerTable />
      </div>
    </div>
  );
}

/* --- Components --- */

const UserSummary = () => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-4">User Summary</h3>
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Active Users</span>
        <span>112</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-green-500 h-2 rounded-full" style={{ width: "70%" }}></div>
      </div>
    </div>
    <div className="mb-4">
      <div className="flex justify-between mb-1 text-sm">
        <span>Inactive Users</span>
        <span>18</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-gray-400 h-2 rounded-full" style={{ width: "20%" }}></div>
      </div>
    </div>
    <div>
      <div className="flex justify-between mb-1 text-sm">
        <span>Suspended</span>
        <span>4</span>
      </div>
      <div className="w-full bg-gray-200 h-2 rounded-full">
        <div className="bg-red-500 h-2 rounded-full" style={{ width: "10%" }}></div>
      </div>
    </div>
  </div>
);

const RecentActivity = () => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-4">Recent Activity</h3>
    <ul className="space-y-3 text-sm text-gray-600">
      <li><span className="font-bold">10 mins ago:</span> User Created - Alex Johnson</li>
      <li><span className="font-bold">25 mins ago:</span> Status Changed - Sarah Miller</li>
      <li><span className="font-bold">1 hour ago:</span> User Updated - David Wilson</li>
    </ul>
  </div>
);

const QuickActions = () => (
  <div className="bg-white p-4 rounded shadow">
    <h3 className="font-semibold mb-4">Quick Actions</h3>
    <button className="w-full bg-blue-100 text-blue-700 py-2 rounded mb-2 hover:bg-blue-200">+ Add New Customer</button>
    <button className="w-full border border-gray-300 py-2 rounded mb-2 hover:bg-gray-100">Generate User Report</button>
    <button className="w-full border border-gray-300 py-2 rounded hover:bg-gray-100">User Permissions</button>
  </div>
);

const CustomerTable = () => (
  <div>
    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Apartment</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Door No</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Packages</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Car Model</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Price</th>
          <th className="border border-gray-300 px-4 py-2 text-center">vehicle No</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Subscription StartDate</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Subscription EndDate</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Pending Washes</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Completed Washes</th>

        </tr>
      </thead>
      <tbody>
        {customers.map((cust, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white uppercase">
                {cust.name.charAt(0)}
              </div>
              <span>{cust.name}</span>
            </td>
            <td className="border border-gray-300 px-4 py-2">{cust.phone}</td>
            <td className="border border-gray-300 px-4 py-2">{cust.email}</td>
            <td className="border border-gray-300 px-4 py-2">{cust.apartment}</td>
            <td className="border border-gray-300 px-4 py-2">{cust.doorNo}</td>
            <td className="border border-gray-300 px-4 py-2">{cust.packages}</td>
            <td className="border border-gray-300 px-4 py-2">{cust.carModel}</td>
            <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.price}</td>
            <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.vehicleNo}</td>
            <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.SubscriptionStartDate}</td>
            <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.SubscriptionEndDate}</td>
             <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.pendingwashes}</td>
              <td className="border border-gray-300 px-4 py-2 font-semibold">{cust.completedwashes}</td>

            {/* <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
              <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
              <button className="text-red-600 hover:text-red-800"><FaTimes /></button>
              <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>

    {/* Pagination */}
    <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
      <div>Showing {customers.length} of 134 results</div>
      <div className="flex items-center space-x-2">
        <button className="border px-3 py-1 rounded hover:bg-gray-100">&lt;</button>
        <button className="border px-3 py-1 rounded bg-blue-500 text-white">1</button>
        <button className="border px-3 py-1 rounded hover:bg-gray-100">2</button>
        <button className="border px-3 py-1 rounded hover:bg-gray-100">3</button>
        <span>...</span>
        <button className="border px-3 py-1 rounded hover:bg-gray-100">12</button>
        <button className="border px-3 py-1 rounded hover:bg-gray-100">&gt;</button>
      </div>
    </div>
  </div>
);

export default Usermanagement;
