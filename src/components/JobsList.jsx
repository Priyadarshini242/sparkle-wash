// src/components/JobsList.jsx
import { Clock, MapPin, Car, Bike } from "lucide-react";

const jobs = [
  {
    id: 1,
    name: "Sarah Johnson",
    vehicle: "SUV - Toyota RAV4 • Premium Wash",
    location: "Downtown Car Hub",
    time: "10:30 AM",
    status: "In Progress",
    icon: <Car className="text-orange-500" size={28} />,
  },
  {
    id: 2,
    name: "Michael Roberts",
    vehicle: "Sedan - Honda Accord • Standard Wash",
    location: "Westside Mall Parking",
    time: "11:15 AM",
    status: "Upcoming",
    icon: <Car className="text-blue-500" size={28} />,
  },
  {
    id: 3,
    name: "Emily Chen",
    vehicle: "Bike - Kawasaki Ninja • Basic Wash",
    location: "Parkview Apartments",
    time: "12:00 PM",
    status: "Upcoming",
    icon: <Bike className="text-indigo-500" size={28} />,
  },
];

export default function JobsList() {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-black font-semibold">Today's Jobs</h2>
        <span className="text-sm text-gray-500">5 jobs for today</span>
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <div
            key={job.id}
            className={`flex justify-between items-start p-4 rounded-xl border ${
              job.status === "In Progress"
                ? "bg-orange-50 border-orange-300"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            {/* Left Section */}
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">{job.icon}</div>
              <div>
                <h3 className="text-start font-semibold">{job.name}</h3>
                <p className="text-sm text-gray-600">{job.vehicle}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1 space-x-3">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {job.location}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {job.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex flex-col items-end space-y-2">
              {/* Status Badge */}
              <span className={`text-xs px-3 py-1 rounded-lg ${job.status === "In Progress" ? "bg-orange-100 text-orange-600" : "bg-blue-100 text-blue-600"}`}>
                {job.status}
              </span>

              {/* Buttons */}
              <div className="flex space-x-2">
                {job.status === "In Progress" ? (
                  <button className="px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 text-sm">
                    Complete Job
                  </button>
                ) : (
                  <button className="px-3 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 text-sm">
                    Start Job
                  </button>
                )}
                <button className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 text-sm">
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
