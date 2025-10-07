import {
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
// import EarningsBarChart from "./components/EarningsBarChart.jsx";
import Sidebar from "./components/Sidebar.jsx";

export default function Jobs() {
  // Example request data (can be passed to child components later)
  const requests = [
    {
      name: "Sarah Johnson",
      details: "SUV - Toyota RAV4 · Premium wash",
      time: "Downtown car Hub · 10:30 AM",
    },
    {
      name: "Michael Roberts",
      details: "SUV - Toyota",
      time: "Downtown car Hub · 10:30 AM",
    },
    {
      name: "Sarah Johnson",
      details: "SUV - Toyota RAV4 · Premium wash",
      time: "Downtown car Hub · 11:00 AM",
    },
  ];

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 bg-white p-10 overflow-auto">
        {/* Header Section (Welcome, Toggle, etc.) */}
        {/* <HeaderCard /> */}
        </main>
    </div>
  );
}
