import React from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom"; // ✅ useLocation

const items = [


  
  { id: "dashboard", label: "Dashboard", Icon: HomeIcon, route: "/dashboard" },
  { id: "jobs", label: "Jobs", Icon: ShoppingCartIcon, route: "/jobs" },
  { id: "earnings", label: "Earnings", Icon: ChartBarIcon, route: "/earning" },
  { id: "profile", label: "Profile", Icon: UserIcon, route: "/profile" },
  { id: "help", label: "Help & Support", Icon: QuestionMarkCircleIcon, route: "/help" },

];

function NavItem({ Icon, label, active }) {
  return (
    <li>
      <div
        aria-current={active ? "page" : undefined}
        className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition
                    ${active ? "bg-blue-700" : "hover:bg-blue-500/40"} focus:outline-none`}
      >
        <Icon className="h-5 w-5 text-white" aria-hidden="true" />
        <span className="font-medium text-white">{label}</span>

        {active && (
          <span
            className="absolute right-0 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-l-full bg-yellow-400"
            aria-hidden="true"
          />
        )}
      </div>
    </li>
  );
}

export default function Sidebar() {
  const location = useLocation(); // ✅ get current path

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-indigo-600 to-blue-600 text-white p-4">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-3">
        <div className="text-2xl">💧</div>
        <div className="text-lg font-semibold">SparkleWash</div>
      </div>

      {/* User profile */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white font-semibold">
          M
        </div>
        <div>
          <div className="text-sm font-semibold text-white">Michael Johnson</div>
          <div className="text-xs text-white/80 mt-0.5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            Available
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1">
        <ul className="space-y-1">
          {items.map((it) => (
            <Link key={it.id} to={it.route}>
              <NavItem
                Icon={it.Icon}
                label={it.label}
                active={location.pathname === it.route} // ✅ active based on route
              />
            </Link>
          ))}
        </ul>
      </nav>

      {/* Sign out */}
      <div className="mt-auto border-t border-white/10 pt-4">
        <button
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-white hover:bg-white/6 transition"
          onClick={() => alert("Sign out clicked")}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5 text-white" />
          <span className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
