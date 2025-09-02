import { useState } from "react";
import { Search, Filter } from "lucide-react";

export default function JobHeader() {
  const [activeTab, setActiveTab] = useState("All Jobs");

  const tabs = ["All Jobs", "In Progress", "Completed"];

  return (
    <div className="flex items-center justify-between bg-white shadow-sm rounded-xl p-3">
      {/* Search */}
      <div className="relative w-300px">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <input
          type="text"
          className="w-full pl-7 pr-2  text-black py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
          placeholder="Search by customer name, location"
        />
      </div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm rounded-lg ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Filter */}
      <button className="flex items-center gap-1 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
        <Filter className="h-4 w-4" />
        Filter
      </button>
    </div>
  );
}
