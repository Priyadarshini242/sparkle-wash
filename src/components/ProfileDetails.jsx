// src/components/ProfilePage.jsx
import React from "react";
import {
  Edit,Car,Bike
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Chart data
const ratingsData = [
  { month: "Jan", rating: 4.5 },
  { month: "Feb", rating: 4.7 },
  { month: "Mar", rating: 4.6 },
  { month: "Apr", rating: 4.9 },
  { month: "May", rating: 4.5 },
  { month: "Jun", rating: 4.7 },
];

// Reviews with images
const reviews = [
  {
    name: "Sarah Johnson",
    date: "June 8, 2023",
    review:
      "Michael did an incredible job with my car. It hasn’t been this clean since I bought it! Very thorough and professional service.",
    img: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    name: "David Wilson",
    date: "June 5, 2023",
    review:
      "Good attention to detail. My bike looks brand new again. Would recommend for anyone who wants quality cleaning.",
    img: "https://randomuser.me/api/portraits/men/2.jpg",
  },
  {
    name: "Emily Chen",
    date: "June 1, 2023",
    review:
      "I’ve been using SparkleWash for months, but Michael is by far the best washer. Very professional and does an amazing job!",
    img: "https://randomuser.me/api/portraits/women/3.jpg",
  },
];

// Service history
const serviceHistory = [
  {
    id: "SH-001",
    date: "June 10, 2023",
    vehicle: "Toyota RAV4 (SUV)",
    service: "Premium Wash",
    customer: "Alex Thompson",
  },
  {
    id: "SH-002",
    date: "June 9, 2023",
    vehicle: "Honda CBR (Bike)",
    service: "Standard Wash",
    customer: "Robert Smith",
  },
  {
    id: "SH-003",
    date: "June 9, 2023",
    vehicle: "Tesla Model 3",
    service: "Premium Wash",
    customer: "Jennifer Lee",
  },
  {
    id: "SH-004",
    date: "June 8, 2023",
    vehicle: "BMW X5",
    service: "Deluxe Wash",
    customer: "Sarah Johnson",
  },
];

export default function Profile() {
  return (
  <div className="p-6 space-y-8 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side: Ratings & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
   <div className="bg-white rounded-2xl shadow p-6">
    <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">Ratings & Reviews</h2>
    <button className="text-blue-600 text-sm">View All</button>
   </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Left: Overall rating */}
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">4.8</h1>
      <div className="flex text-yellow-400 mt-1">
        {"★★★★★".split("").map((s, i) => (
          <span key={i}>{s}</span>
        ))}
      </div>
      <p className="text-gray-500 text-sm mt-1">Based on 98 reviews</p>
      {/* rating bars */}
       <div className="mt-6 w-full space-y-2">
        {[5, 4, 3, 2, 1].map((star, i) => (
        <div key={i} className="flex items-center space-x-2">
          <span className="text-sm font-medium w-4">{star}</span>
          <div className="flex-1 bg-yellow-200 rounded h-2">
            <div
              className="bg-yellow-400 h-2 rounded"
              style={{
                width:
                  star === 5
                    ? "85%"
                    : star === 4
                    ? "10%"
                    : star === 3
                    ? "3%"
                    : star === 2
                    ? "2%"
                    : "0%",
              }}
            ></div>
          </div>
        </div>
        ))}
        </div>
        </div>
       {/* Right: Chart */}
      <div className="col-span-1">
  <ResponsiveContainer width="200%" height={200}>
    <BarChart data={ratingsData}>
      <CartesianGrid strokeDasharray="3 3" vertical={false} />
      <XAxis dataKey="month" />
      <YAxis domain={[3.5, 5]} />
      <Tooltip />
      <Bar 
        dataKey="rating" 
        fill="#2563eb" 
        radius={[10, 10, 0, 0]}  // rounded top corners only
        barSize={40}             // optional: consistent width
      />
    </BarChart>
  </ResponsiveContainer>
</div>

       </div>
  </div>
 
       {/* Reviews */}
<div className="bg-white rounded-2xl shadow p-6">
  <h2 className="text-lg  text-start font-bold mb-4">Recent Reviews</h2>
  <div className="space-y-6">
    {reviews.map((r, i) => (
      <div key={i} className="pb-6 border-b last:border-b-0 last:pb-0">
        <div className="flex  text-start items-center gap-4">
          {/* Profile Image */}
          <img
            src={r.img}
            alt={r.name}
            className="w-12 h-12 rounded-full object-cover"
          />

          {/* Name + Stars + Date */}
          <div>
            {/* Name */}
            <p className="font-semibold">{r.name}</p>

            {/* Stars + Date */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex text-yellow-400 text-sm">
                {"★★★★★".split("").map((s, idx) => (
                  <span key={idx}>{s}</span>
                ))}
              </div>
              <span className="text-gray-500 text-sm">{r.date}</span>
            </div>
          </div>
        </div>

        {/* Review Text */}
        <p className="mt-3 text-gray-700">{r.review}</p>
      </div>
    ))}
  </div>
</div>


        
          {/* Service history */}
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Recent Service History</h2>
              <button className="text-blue-600 text-sm">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Date</th>
                    <th className="p-3 text-left">Vehicle</th>
                    <th className="p-3 text-left">Service</th>
                    <th className="p-3 text-left">Customer</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceHistory.map((s, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-3">{s.id}</td>
                      <td className="p-3">{s.date}</td>
                      <td className="p-3">{s.vehicle}</td>
                      <td className="p-3">{s.service}</td>
                      <td className="p-3">{s.customer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Skills */}
          {/* Skills & Services */}
<div className="bg-white rounded-2xl shadow p-6">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-bold">Skills & Services</h2>
    <button className="text-blue-600 text-sm flex items-center gap-1">
      <Edit size={16} />
      Edit
    </button>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {[
      { name: "Car Detailing", level: "Expert", icon: <Car className="w-4 h-4 text-gray-600" /> },
      { name: "Motorcycle Cleaning", level: "Expert",  icon: <Bike className="w-4 h-4 text-gray-600" /> },
      { name: "Interior Detailing", level: "Advanced", icon: <Car className="w-4 h-4 text-gray-600" />},
      { name: "Ceramic Coating", level: "Intermediate",  icon: <Bike className="w-4 h-4 text-gray-600" /> },
    ].map((skill, i) =>(
      <div key={i}className="p-4 border rounded-xl flex items-center gap-3 hover:shadow transition">
        {/* Icon */}
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-xl">
          {skill.icon}
        </div>

        {/* Text */}
        <div>
          <p className="font-semibold">{skill.name}</p>
          <p className="text-gray-500 text-sm">{skill.level}</p>
              </div>
              </div>
                ))}
           </div>
        </div>

        </div>
        {/* Right side info */}
        {/* Right side info */}
<div className="space-y-8">
  {/* Personal info */}
  <div className="bg-white rounded-2xl shadow p-15">
    <div className="flex justify-between items-center mb-4">
  <h2 className="text-lg font-bold">Personal Information</h2>
  <button className="text-blue-600 text-sm flex items-center gap-1">
    <Edit size={16} /> Edit
  </button>
</div>

    <div className="space-y-3 text-sm text-left">
      <div>
        <p className="text-gray-500 text-xs uppercase">Full Name</p>
        <p className="font-medium">Michael Johnson</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Email Address</p>
        <p className="font-medium">michael.johnson@example.com</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Phone Number</p>
        <p className="font-medium">(555) 123-4567</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Address</p>
        <p className="font-medium">
          123 Main Street, Apt 4B <br /> San Francisco, CA 94105
        </p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Date Joined</p>
        <p className="font-medium">January 15, 2022</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Bio</p>
        <p className="text-gray-700">
          Professional car and bike cleaner with over 5 years of experience in
          premium detailing. Specialized in interior cleaning and exterior
          polishing techniques.
        </p>
      </div>
    </div>
  </div>
  

  {/* Bank info */}
  <div className="bg-white rounded-2xl shadow p-15">
   <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">Bank Information</h2>
      <button className="text-blue-600 text-sm flex items-center gap-1">
        <Edit size={16} /> Edit
      </button>
    </div>

    {/* Info note */}
    <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg flex items-center gap-2 mb-4">
      <svg
        className="w-5 h-5 flex-shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 11c0 .414-.336.75-.75.75H11v2h1.25c.414 0 .75.336.75.75v.25h-3V9h3v.25c0 .414-.336.75-.75.75H11v1h1.25c.414 0 .75.336.75.75z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z"
        />
      </svg>
      Your bank information is securely stored and encrypted
    </div>

     <div className="space-y-3 text-sm text-left">
      <div>
        <p className="text-gray-500 text-xs uppercase">Account Holder Name</p>
        <p className="font-medium">Michael Johnson</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Bank Name</p>
        <p className="font-medium">Pacific National Bank</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Account Number</p>
        <p className="font-medium">••••4567</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Routing Number</p>
        <p className="font-medium">••••1234</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Payment Method</p>
        <p className="font-medium">Direct Deposit (Bi-weekly)</p>
      </div>
    </div>

    <button className="mt-5 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold">
      Update Payment Information
    </button>
  </div>

  {/* Tax info */}
  <div className="bg-white rounded-2xl shadow p-15">
       <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-bold">Tax Information</h2>
      <button className="text-blue-600 text-sm flex items-center gap-1">
        <Edit size={16} /> Edit
      </button>
    </div>
    <div className="space-y-3 text-sm text-left">
      <div>
        <p className="text-gray-500 text-xs uppercase">Tax Classification</p>
        <p className="font-medium">Independent Contractor</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Tax ID Type</p>
        <p className="font-medium">SSN</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">Tax ID Number</p>
        <p className="font-medium">••••1234</p>
      </div>
      <div>
        <p className="text-gray-500 text-xs uppercase">W-9 Form</p>
        <a href="#" className="text-blue-600 underline font-medium">
          W9-Form-2023.pdf
        </a>
      </div>
    </div>
  </div>
</div>




      </div>
    </div>
  );
}
