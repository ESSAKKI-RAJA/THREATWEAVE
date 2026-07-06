import { Link, useLocation } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";
import { useUIStore } from "../store/uiStore";
import {
  LayoutDashboard,
  ShieldAlert,
  Network,
  SearchCode,
  BellRing,
  Settings,
  Shield,
} from "lucide-react";

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const isBypass = import.meta.env.VITE_BYPASS_AUTH === "true";

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
    { name: "Threat Intel", to: "/intelligence", icon: ShieldAlert },
    { name: "Supply Chain", to: "/supply-chain", icon: Network },
    { name: "Investigations", to: "/investigations", icon: SearchCode },
    { name: "Live Alerts", to: "/alerts", icon: BellRing },
    { name: "Settings", to: "/settings", icon: Settings },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed left-0 top-0 h-full z-40 bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ease-in-out shadow-xl ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Brand Header */}
      <div className="border-b border-slate-800 flex items-center p-4 h-16 shrink-0">
        <div className="flex items-center space-x-3 overflow-hidden w-full">
          <div
            className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/20 flex items-center justify-center shrink-0 shadow-sm cursor-pointer hover:bg-teal-500/20 hover:border-teal-500/40 transition-colors"
            onClick={toggleSidebar}
          >
            <Shield className="text-teal-400 w-5 h-5" />
          </div>
          <div
            className={`flex flex-col whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"}`}
          >
            <h1 className="font-bold uppercase tracking-tight text-[15px] text-slate-100 leading-none">
              THREATWEAVE
            </h1>
            <p className="text-[10px] text-teal-500 uppercase tracking-widest font-semibold mt-0.5 leading-none">
              Enterprise
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 flex flex-col gap-2 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group overflow-hidden ${
                isActive
                  ? "bg-teal-500/15 text-teal-400 font-semibold shadow-sm border border-teal-500/20"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/50 border border-transparent"
              } ${sidebarOpen ? "justify-start gap-3" : "justify-center"}`}
              title={!sidebarOpen ? item.name : undefined}
            >
              <div className="shrink-0 flex items-center justify-center w-6 h-6">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? "scale-110" : "group-hover:scale-110"
                  }`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={`text-sm tracking-wide whitespace-nowrap transition-all duration-300 ${sidebarOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 w-0 hidden"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Profile Card Footer */}
      <div
        className={`p-4 border-t border-slate-800 bg-slate-950/50 flex items-center shrink-0 transition-all duration-300 ${sidebarOpen ? "gap-3" : "justify-center"}`}
      >
        <div
          className={`flex items-center gap-3 overflow-hidden ${sidebarOpen ? "w-full opacity-100" : "w-0 opacity-0 hidden"}`}
        >
          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-sm shadow-inner shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate leading-tight">
              Admin User
            </p>
            <p className="text-[11px] text-slate-400 font-mono truncate leading-tight mt-0.5">
              Administrator
            </p>
          </div>
        </div>
        {!isBypass && (
          <div className={`shrink-0 ${!sidebarOpen && "mx-auto"}`}>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10 rounded-full border-2 border-slate-800 shadow-sm",
                },
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
