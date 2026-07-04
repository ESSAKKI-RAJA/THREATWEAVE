import { Outlet, useLocation, Navigate } from "@tanstack/react-router";
import { UserButton, useAuth } from "@clerk/tanstack-react-start";
import React from "react";
import { CommandPalette } from "./CommandPalette";
import { Sidebar } from "./Sidebar";
import { useUIStore } from "../store/uiStore";

export function AppShell() {
  const location = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const isVendorDetail = location.pathname.match(/^\/vendors\/[^/]+$/);
  const isBypass = import.meta.env.VITE_BYPASS_AUTH === "true";

  const content = (
    <div className="bg-slate-950 text-slate-100 font-sans min-h-screen flex flex-col md:flex-row antialiased selection:bg-teal-900 selection:text-teal-100">
      {/* Sidebar - hidden on vendor detail unless toggled? Actually we'll just use the store to control width */}
      {!isVendorDetail && <Sidebar />}

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col min-h-screen bg-slate-950 relative transition-all duration-300 ${
          !isVendorDetail ? (sidebarOpen ? "md:ml-64" : "md:ml-20") : "ml-0"
        }`}
      >
        {/* Top Navigation */}
        <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur flex items-center justify-between px-6 z-30 sticky top-0">
          <div className="flex items-center gap-4">
            <span className="font-bold tracking-tighter text-teal-500 md:hidden uppercase">
              THREATWEAVE
            </span>
            <button
              className="md:hidden text-slate-400 hover:text-slate-100 transition-colors"
              onClick={toggleSidebar}
            >
              <span className="material-symbols-outlined text-2xl">menu</span>
            </button>
          </div>
          <div className="flex items-center gap-4">
            {!isBypass ? (
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8 rounded-md border border-slate-800 shadow-sm",
                  },
                }}
              />
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></span>
                <span className="text-xs font-mono text-slate-400 uppercase">OPERATIONAL MODE</span>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 w-full max-w-[1600px] mx-auto relative">
          <CommandPalette />
          <Outlet />
        </main>
      </div>
    </div>
  );

  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // Or a loading spinner

  if (isBypass || isSignedIn) return content;

  return <Navigate to="/login" />;
}
