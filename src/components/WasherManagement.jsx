import { useState } from "react";
import Sidebar from "./Sidebar";

export default function WasherManagement() {
  // Dummy washers
  const [washers] = useState([
    { id: 1, name: "John Doe", mobile: "9876543210", email: "john@example.com", status: "Active", totalWashes: 25 },
    { id: 2, name: "Jane Smith", mobile: "9123456780", email: "jane@example.com", status: "Inactive", totalWashes: 12 },
    { id: 3, name: "David Johnson", mobile: "9988776655", email: "david@example.com", status: "Active", totalWashes: 40 },
    { id: 1, name: "John Doe", mobile: "9876543210", email: "john@example.com", status: "Active", totalWashes: 25 },
    { id: 2, name: "Jane Smith", mobile: "9123456780", email: "jane@example.com", status: "Inactive", totalWashes: 12 },
    { id: 3, name: "David Johnson", mobile: "9988776655", email: "david@example.com", status: "Active", totalWashes: 40 },
  ]);

  // Dummy activities
  const [activities] = useState([
    { id: 1, type: "User Created", user: "Alex Johnson", time: "10 minutes ago" },
    { id: 2, type: "Status Changed", user: "Sarah Miller", time: "25 minutes ago" },
    { id: 3, type: "User Updated", user: "David Wilson", time: "1 hour ago" },
  ]);

  // Summary
  const activeUsers = washers.filter((w) => w.status === "Active").length;
  const inactiveUsers = washers.filter((w) => w.status === "Inactive").length;
  const totalUsers = washers.length;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center mb-6">
          Washing Person Management
        </h1>

        {/* === TOP SECTION: Summary + Recent Activity === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* User Summary */}
          <div className="border rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Washer Summary</h2>

            <div className="mb-4">
              <p className="flex justify-between text-sm">
                <span>Active Users</span>
                <span>{activeUsers}</span>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-green-500 h-2 rounded"
                  style={{ width: `${(activeUsers / totalUsers) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-4">
              <p className="flex justify-between text-sm">
                <span>Inactive Users</span>
                <span>{inactiveUsers}</span>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div
                  className="bg-red-500 h-2 rounded"
                  style={{ width: `${(inactiveUsers / totalUsers) * 100 || 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <p className="flex justify-between text-sm">
                <span>Total Users</span>
                <span>{totalUsers}</span>
              </p>
              <div className="w-full bg-gray-200 h-2 rounded">
                <div className="bg-blue-500 h-2 rounded" style={{ width: "100%" }}></div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="border rounded-lg p-4 shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Washer Recent Activity</h2>
            <ul>
              {activities.map((activity) => (
                <li key={activity.id} className="mb-3">
                  <p className="font-medium">{activity.type}</p>
                  <p className="text-sm text-gray-600">
                    {activity.user} • {activity.time}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* === BOTTOM SECTION: Table === */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Mobile No</th>
                <th className="border px-4 py-2">Email</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Total Washes</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {washers.map((washer) => (
                <tr key={washer.id} className="text-center">
                  <td className="border px-4 py-2">{washer.name}</td>
                  <td className="border px-4 py-2">{washer.mobile}</td>
                  <td className="border px-4 py-2">{washer.email}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        washer.status === "Active" ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {washer.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{washer.totalWashes}</td>
                  <td className="border px-4 py-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}