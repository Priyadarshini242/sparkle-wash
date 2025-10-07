import { Car, Bike, Clock, MapPin } from "lucide-react";

const newRequests = [
  {
    id: 1,
    name: "Sarah Johnson",
    vehicle: "SUV - Toyota RAV4 • Premium Wash",
    location: "Downtown Car Hub",
    time: "10:30 AM",
    price: "₹35.00",
    icon: <Car className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 2,
    name: "Michael Roberts",
    vehicle: "Sedan - Honda Accord • Standard Wash",
    location: "Westside Mall Parking",
    time: "11:15 AM",
    price: "₹25.00",
    icon: <Car className="w-6 h-6 text-blue-500" />,
  },
  {
    id: 3,
    name: "Emily Chen",
    vehicle: "Bike - Kawasaki Ninja • Basic Wash",
    location: "Parkview Apartments",
    time: "12:00 PM",
    price: "₹18.50",
    icon: <Bike className="w-6 h-6 text-blue-500" />,
  },
];

const todaySchedule = [
  { id: 1, name: "John Davis", service: "Car Wash - Premium", time: "2:30", status: "Completed" },
  { id: 2, name: "Alexandra Wong", service: "Bike Wash - Standard", time: "4:15", status: "Upcoming" },
  { id: 3, name: "Robert Smith", service: "Car Wash - Basic", time: "5:45", status: "Upcoming" },
];

export default function DashboardCards() {
  return (
    <div className="p-6 bg-gray-60 min-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* New Requests */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">New Requests</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {newRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between  p-4 hover:shadow">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-full">{req.icon}</div>
                  <div>
                    <p className="text-start font-medium">{req.name}</p> 
                    <p className="text-sm text-gray-600">{req.vehicle}</p>
                    <div className="flex items-center text-sm text-gray-500 gap-2 mt-1">
                      <MapPin className="w-4 h-4" /> {req.location}
                      <Clock className="w-4 h-4 ml-2" /> {req.time}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-semibold text-yellow-600">{req.price}</span>
                  <div className="flex gap-6">
                    <button className="px-3 py-1 border border-red-400 text-red-500 rounded-md text-sm hover:bg-red-50">
                      Decline
                    </button>
                    <button className="px-3 py-1 bg-yellow-400 text-white rounded-md text-sm hover:bg-yellow-500">
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="bg-white shadow-md rounded-2xl p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Today’s Schedule</h2>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
            {todaySchedule.map((sch) => (
              <div key={sch.id} className="flex items-center justify-between  pb-3 last:border-none">
                <div>
                  <p className="text-start font-medium">{sch.name}</p>
                  <p className="text-sm text-gray-600">{sch.service}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">{sch.time}</span>
                  {sch.status === "Completed" ? (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded-md">Completed</span>
                  ) : (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-md">Upcoming</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}