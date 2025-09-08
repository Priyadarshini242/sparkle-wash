import {
  HomeIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
  QuestionMarkCircleIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import Sidebar from "./Sidebar.jsx";
import HeaderCard from "./HeaderCard.jsx";
import DashboardCards from "./DashBoardCards.jsx";
import React from "react";
import EarningsBarChart from "./EarningsBarChart.jsx";

export default function DashBoardWelcome() {
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
        <HeaderCard />
        {/* Dashboard Content */}
        <DashboardCards />

        <section className="max-w-10xl mx-auto flex flex-col lg:flex-row gap-6 mt-6">
         {/* Left Column - JobsList + UpcomingJobs + JobHeader */}
          <div>
            <div className="flex flex-col gap-6">
                {/* <div className="bg-white shadow rounded-xl p-4">
                  <JobHeader/>
                </div> */}
            
                {/* <div className="bg-white  text-black shadow rounded-xl p-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4"></h1>
                  <JobsList />
                </div> */}
                <div className="bg-white  text-black shadow rounded-xl p-4">
                  <h1 className="text-2xl font-bold text-gray-800 mb-4"></h1>
                  <EarningsBarChart />
                </div>
            </div>
          </div>
        </section> 
         </main>
    </div>
  );
}
