import React, { useState } from "react";
import {
  HomeIcon,
  ShoppingCartIcon,
  ChartBarIcon,
  UserIcon,
  QuestionMarkCircleIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link } from "react-router";

/*
  White-heading visual concept:
  - All labels/icons use solid white (text-white).
  - Active item uses a subtle white translucent background and a yellow indicator bar.
  - Hover increases contrast using hover:bg-white/10.
*/

const items = [
  { id: "dashboard", label: "Dashboard", Icon: HomeIcon, route:'/' },
  { id: "jobs", label: "Jobs", Icon: ShoppingCartIcon, route:'/jobs' },
  { id: "earnings", label: "Earnings", Icon: ChartBarIcon , route:'/earning'},
  { id: "profile", label: "Profile", Icon: UserIcon },
  { id: "help", label: "Help & Support", Icon: QuestionMarkCircleIcon },
];

function NavItem({ Icon, label, active, onClick }) {
  return (
    <li>
      <button
        onClick={onClick}
        aria-current={active ? "page" : undefined}
        className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-3 text-left transition
                    ${active ? "bg-blue-700" : "hover:bg-blue-500/40"} focus:outline-none`}

      >
        {/* icon (white) */}
        <Icon className="h-5 w-5 text-white" aria-hidden="true" />

        {/* label in white — this is the 'white colour concept' */}
        <span className="font-medium text-white">{label}</span>

        {/* yellow active bar on the right when active */}
        {active && (
          <span
            className="absolute right-0 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded-l-full bg-yellow-400"
            aria-hidden="true"
          />
        )}
      </button>
    </li>
  );
}

export default function Sidebar() {
  const [activeId, setActiveId] = useState("jobs"); // default active = jobs

  return (
    <aside className="flex h-screen w-64 flex-col bg-gradient-to-b from-indigo-600 to-blue-600 text-white p-4">
      {/* Brand */}
      <div className="mb-6 flex items-center gap-3">
        <div className="text-2xl">💧</div>
        <div className="text-lg font-semibold">SparkleWash</div>
      </div>

      {/* Optional User profile area */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3">
        <div className="relative h-10 w-10 flex items-center justify-center rounded-full bg-white/20 text-white font-semibold">
          M
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full" />
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
            <Link to={it.route}>
            <NavItem
              key={it.id}
              Icon={it.Icon}
              label={it.label}
              active={activeId === it.id}
              onClick={() => setActiveId(it.id)}
            />
            </Link>
          ))}
        </ul>
      </nav>

      {/* Sign out pinned to bottom */}
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
