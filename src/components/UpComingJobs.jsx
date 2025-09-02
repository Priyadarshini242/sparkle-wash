// src/components/UpcomingJobs.jsx
import React from "react";
import { Car, Bike, MapPin, Clock } from "lucide-react";

const jobs = [
  {
    id: 1,
    name: "John Davis",
    vehicle: "SUV - Jeep Cherokee • Premium Wash",
    location: "North Hills Car Wash",
    time: "Tomorrow, 9:15 AM",
    icon:<Car className="text-gray-500" size={28} />, 
  },
  {
    id: 2,
    name: "Alexandra Wong",
    vehicle: "Bike - Suzuki GSX • Standard Wash",
    location: "Eastside Service Center",
    time: "Tomorrow, 11:00 AM",
    icon:<Bike className="text-gray-500" size={28} />,
  },
];

export default function UpcomingJobs() {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-black font-semibold">Upcoming Jobs</h2>
        <a href="#" className="text-blue-600 text-sm font-medium flex items-center space-x-1 hover:underline">
          <span>View All</span>
          <span>→</span>
        </a>
      </div>

      {/* Job List */}
      <div className="divide-y">
        {jobs.map((job) => (
          <div key={job.id} className="flex justify-between items-center py-4">
            {/* Left Side */}
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-full text-2xl">
                {job.icon}
              </div>
              <div>
                <h3 className="font-semibold">{job.name}</h3>
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

            {/* Right Side */}
            <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 text-sm">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
