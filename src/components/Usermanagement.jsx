// src/App.js

import React, { useState } from "react";
import { FaEdit, FaTrash, FaTimes } from "react-icons/fa";

const users = [
  { name: "Alex Thompson", email: "alex.thompson@example.com", status: "Active", dateJoined: "10 Jun 2023" },
  { name: "Sarah Johnson", email: "sarah.johnson@example.com", status: "Active", dateJoined: "05 Jun 2023" },
  { name: "Michael Roberts", email: "michael.roberts@example.com", status: "Active", dateJoined: "01 Jun 2023" },
  { name: "Emily Chen", email: "emily.chen@example.com", status: "Inactive", dateJoined: "28 May 2023" },
  { name: "Robert Brown", email: "robert.brown@example.com", status: "Active", dateJoined: "25 May 2023" },
  { name: "Jennifer Lopez", email: "jennifer.lopez@example.com", status: "Active", dateJoined: "22 May 2023" },
  { name: "David Wilson", email: "david.wilson@example.com", status: "Inactive", dateJoined: "18 May 2023" },
];

function Usermanagement() {
  const [activeTab, setActiveTab] = useState("customers");

  return (
    <div className="p-6 bg-gray-50 max-h-screen">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-sm text-gray-500">Friday, June 30, 2023</p>
        </div>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 flex items-center">
          Export Users
        </button>
      </header>

      {/* Tabs */}
      <div className="border-b mb-6">
        <nav className="flex space-x-6">
          <button onClick={() => setActiveTab("customers")} className={`pb-2 ${activeTab === "customers" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
            Customer Management
          </button>
          <button onClick={() => setActiveTab("washing")} className={`pb-2 ${activeTab === "washing" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}>
            Washing Person Management
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <UserSummary />
        <RecentActivity />
        <QuickActions />
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <input type="text" placeholder="Search customers..." className="border rounded px-3 py-2 w-full md:w-1/3 mb-2 md:mb-0" />
          <div className="flex gap-2">
            <select className="border rounded px-3 py-2">
              <option>Status</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <select className="border rounded px-3 py-2">
              <option>Date Joined</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
            <button className="border rounded px-3 py-2">More Filters</button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Add New Customer</button>
          </div>
        </div>

        <UserTable />
      </div>
    </div>
  );
}

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

const UserTable = () => (
  <div>
    <table className="w-full table-auto border-collapse border border-gray-200 text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
          <th className="border border-gray-300 px-4 py-2 text-left">Date Joined</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={idx} className="hover:bg-gray-50">
            <td className="border border-gray-300 px-4 py-2 flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center text-white uppercase">{user.name.charAt(0)}</div>
              <span>{user.name}</span>
            </td>
            <td className="border border-gray-300 px-4 py-2">{user.email}</td>
            <td className="border border-gray-300 px-4 py-2">
              <span className={`px-2 py-1 rounded text-xs ${user.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                {user.status}
              </span>
            </td>
            <td className="border border-gray-300 px-4 py-2">{user.dateJoined}</td>
            <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
              <button className="text-blue-600 hover:text-blue-800"><FaEdit /></button>
              <button className="text-red-600 hover:text-red-800"><FaTimes /></button>
              <button className="text-red-600 hover:text-red-800"><FaTrash /></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="flex justify-between items-center mt-4 text-gray-600 text-sm">
      <div>Showing 7 of 134 results</div>
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
