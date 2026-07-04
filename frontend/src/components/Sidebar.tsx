import { Link, useLocation } from "@tanstack/react-router";
import { UserButton } from "@clerk/tanstack-react-start";
import { useUIStore } from "../store/uiStore";

export function Sidebar() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const isBypass = false;

  const navItems = [
    { name: "Dashboard", to: "/dashboard", icon: "dashboard" },
    { name: "Threat Intel", to: "/intelligence", icon: "gpp_maybe" },
    { name: "Supply Chain", to: "/supply-chain", icon: "hub" },
    { name: "Active Investigations", to: "/investigations", icon: "troubleshoot" },
    { name: "Live Alerts", to: "/alerts", icon: "notifications_active" },
  ];

  return (
    <nav
      aria-label="Main Navigation"
      className={`fixed left-0 top-0 h-full z-40 bg-slate-950 border-r border-slate-800 flex flex-col transition-all duration-300 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Brand Header */}
      <div className="border-b border-slate-800 flex items-center p-4 h-16 justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div
            className="w-8 h-8 rounded bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0 shadow-sm cursor-pointer"
            onClick={toggleSidebar}
          >
            <span className="material-symbols-outlined text-teal-500 text-lg font-bold">
              security
            </span>
          </div>
          {sidebarOpen && (
            <div className="whitespace-nowrap transition-opacity duration-300">
              <h1 className="font-bold uppercase tracking-tight text-sm text-slate-100">
                THREATWEAVE
              </h1>
              <p className="text-[10px] text-teal-500 uppercase tracking-widest font-semibold">
                Enterprise
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.name}
              to={item.to}
              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                isActive
                  ? "bg-teal-600/20 text-teal-500 font-semibold shadow-md border border-teal-500/30"
                  : "text-slate-400 hover:text-slate-100 hover:bg-slate-900 border border-transparent hover:border-slate-800"
              } ${sidebarOpen ? "justify-start gap-3" : "justify-center"}`}
              title={!sidebarOpen ? item.name : undefined}
            >
              <span
                className={`material-symbols-outlined text-xl transition-colors duration-200 ${
                  isActive ? "text-teal-500" : "text-slate-400 group-hover:text-teal-400"
                }`}
              >
                {item.icon}
              </span>
              {sidebarOpen && (
                <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Profile Card Footer */}
      <div
        className={`p-4 border-t border-slate-800 bg-slate-950 flex items-center ${sidebarOpen ? "gap-3" : "justify-center"}`}
      >
        {sidebarOpen && (
          <>
            <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-sm shadow-md shrink-0">
              AD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-100 truncate">Admin</p>
              <p className="text-[10px] text-slate-400 font-mono truncate">Administrator</p>
            </div>
          </>
        )}
        {!isBypass && (
          <div className="shrink-0">
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 rounded-md border border-slate-700 shadow-sm",
                },
              }}
            />
          </div>
        )}
      </div>
    </nav>
  );
}
