// src/components/JobDetails.jsx
import { PhoneIcon, MapPinIcon, UserCircleIcon } from "@heroicons/react/24/outline";

export default function JobDetails() {
  return (
 
    <div className="max-w-5xl mx-auto bg-white shadow-md rounded-2xl p-2 space-y-6">
      {/* Header */}
      <h2 className="text-lg font-semibold text-gray-800">Job Details</h2>

      {/* Customer Info */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">CUSTOMER INFORMATION</h3>
        <div className="flex items-center gap-3">
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
          <div>
            <p className="font-medium text-gray-800">Sarah Johnson</p>
            <p className="text-sm text-gray-500">Premium Member</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <PhoneIcon className="w-4 h-4" />
          <span>(555) 123-4567</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPinIcon className="w-4 h-4" />
          <span>123 Main Street, Downtown, Cityville</span>
        </div>
      </div>

      {/* Service Details */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-500">SERVICE DETAILS</h3>
        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Service Type</span>
            <span className="font-medium">Premium Car Wash</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Vehicle</span>
            <span className="font-medium">Toyota RAV4 (SUV)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Color</span>
            <span className="font-medium">Silver</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">License Plate</span>
            <span className="font-semibold">ABC-1234</span>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">SPECIAL INSTRUCTIONS</h3>
        <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700">
          Please pay extra attention to the interior carpet cleaning and dashboard.
          There's a small scratch on the passenger door that needs special care.
        </div>
      </div>

      {/* Job Status */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-gray-500">JOB STATUS</h3>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-orange-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            In Progress
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Start Time</span>
            <span>10:30 AM</span>
          </div>
          <div className="flex justify-between text-sm text-gray-700">
            <span>Estimated Completion</span>
            <span>11:15 AM</span>
          </div>
        </div>
        {/* <button className="bg-yellow-400 text-blue-600 font-medium px-6 py-2 rounded-md shadow-md hover:bg-yellow-500 transition">
                Mark as Completed
         </button>
      <div class="flex space-x-4">
        <button class="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
         Contact Customer
        </button>
        <button class="px-4 py-2 border border-black-500 text-black-500 rounded-lg hover:bg-black-50">
           Report Issue
       </button>
       </div> */}
 {/* Buttons */}
        <div className="space-y-3">
          {/* Mark as Completed */}
          <button className="w-full bg-yellow-400 text-gray-800 font-medium px-6 py-3 rounded-lg shadow-md hover:bg-yellow-500 transition">
            Mark as Completed
          </button>

          {/* Contact + Report Issue */}
          <div className="flex gap-4">
            <button className="flex-1 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50">
              Contact Customer
            </button>
            <button className="flex-1 px-4 py-2 border border-gray-400 text-gray-600 rounded-lg hover:bg-gray-50">
              Report Issue
            </button>
          </div>
        </div>

  
      </div>
    </div>
   
  );
}
