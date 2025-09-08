import React from "react";
import { Clock, MapPin, Car, Bike } from "lucide-react";


export default function DashboardCards() {
  const requests = [
    {
      name: "Sarah Johnson",
      vehicle: "SUV - Toyota RAV4 • Premium Wash",
      location: "Downtown Car Hub",
      time: "10:30 AM",
      price: "₹35.00",
      icon: <Car className="text-orange-500" size={28} />,
    },
    {
      name: "Michael Roberts",
      vehicle: "Sedan - Honda Accord • Standard Wash",
      location: "Westside Mall Parking",
      time: "11:15 AM",
      price: "₹25.00",
      icon: <Car className="text-gray-500" size={28} />,
    },
    {
      name: "Emily Chen",
      vehicle: "Bike - Kawasaki Ninja • Basic Wash",
      location: "Parkview Apartments",
      time: "12:00 PM",
      price: "₹18.50",
      icon: <Bike className="text-gray-500" size={28} />,
    },
  ];

  const schedule = [
    { time: "2:30", name: "John Davis", service: "Car Wash - Premium", status: "Completed" },
    { time: "4:15", name: "Alexandra Wong", service: "Bike Wash - Standard", status: "Upcoming" },
    { time: "5:45", name: "Robert Smith", service: "Car Wash - Basic", status: "Upcoming" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50">
      {/* New Requests */}
      <div className="col-span-2 bg-white p-5 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New Requests</h2>
          <a href="#" className="text-blue-600 text-sm font-medium">View All →</a>
        </div>
        <div className="space-y-4">
          {requests.map((req, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 border rounded-xl hover:shadow-sm transition"
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{req.icon}</span>
                <div>
                  <p className="font-semibold">{req.name}</p>
                  <p className="text-gray-600 text-sm">{req.vehicle}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-3 mt-1">
                    <span>📍 {req.location}</span>
                    <span>⏰ {req.time}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-400 px-3 py-1 rounded-md text-black font-semibold">
                  {req.price}
                </span>
                <button className="px-3 py-1 text-sm border border-red-400 text-red-500 rounded-lg hover:bg-red-50">
                  Decline
                </button>
                <button className="px-3 py-1 text-sm bg-yellow-400 rounded-lg hover:bg-yellow-500">
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white p-5 rounded-2xl shadow">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Today's Schedule</h2>
          <a href="#" className="text-blue-600 text-sm font-medium">View All →</a>
        </div>
        <div className="space-y-4">
          {schedule.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-blue-600 font-semibold">
                  {item.time}
                </span>
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-gray-600 text-sm">{item.service}</p>
                </div>
              </div>
              <span
                className={`px-3 py-1 text-sm rounded-lg ${
                  item.status === "Completed"
                    ? "bg-green-100 text-green-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
